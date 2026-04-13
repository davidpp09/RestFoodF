import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.isConnected = false;
        this.pendingSubscriptions = [];
        this.connectionCount = 0;
        this._statusListeners = [];
    }

    // — Estado de conexión —
    _notificar(estado) {
        this._statusListeners.forEach(fn => fn(estado));
    }

    onStatusChange(fn) {
        this._statusListeners.push(fn);
        return () => { this._statusListeners = this._statusListeners.filter(l => l !== fn); };
    }

    conectar(token) {
        this.connectionCount++;
        if (this.stompClient?.active) return;

        this.stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws-restfood'),
            connectHeaders: { 'Authorization': `Bearer ${token}` },
            debug: (str) => {
                if (str.includes('CONNECTED') || str.includes('DISCONNECT')) console.log(str);
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('✅ WebSocket conectado');
                this.isConnected = true;
                this._notificar('conectado');
                this.pendingSubscriptions.forEach(({ topic, callback }) => {
                    this.stompClient.subscribe(topic, callback);
                });
                this.pendingSubscriptions = [];
            },
            onStompError: (frame) => {
                console.error('❌ Error STOMP:', frame.headers['message']);
                this._notificar('error');
            },
            onWebSocketClose: () => {
                console.log('🔌 WebSocket cerrado');
                this.isConnected = false;
                this._notificar('reconectando');
            },
        });

        this.stompClient.activate();
        this._notificar('reconectando');
    }

    subscribe(topic, callback) {
        const wrapped = (message) => {
            try { callback(JSON.parse(message.body)); }
            catch (error) { console.error(`❌ Error procesando mensaje de ${topic}:`, error); }
        };

        if (this.isConnected) {
            return this.stompClient.subscribe(topic, wrapped);
        } else {
            this.pendingSubscriptions.push({ topic, callback: wrapped });
        }
    }

    desconectar() {
        this.connectionCount--;
        if (this.connectionCount <= 0 && this.stompClient) {
            this.stompClient.deactivate();
            this.isConnected = false;
            this.connectionCount = 0;
            this.pendingSubscriptions = [];
            this._notificar('desconectado');
            console.log('👋 WebSocket desconectado');
        }
    }
}

export default new WebSocketService();
