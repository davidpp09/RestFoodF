import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.isConnected = false;
        this.activeSubscriptions = []; // { id, topic, callback, sub? } — persistentes
        this.connectionCount = 0;
        this._statusListeners = [];
        this._subIdSeq = 0;
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

        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        this.stompClient = new Client({
            webSocketFactory: () => new SockJS(`${baseUrl}/ws-restfood`),
            connectHeaders: { 'Authorization': `Bearer ${token}` },
            debug: (str) => {
                if (str.includes('CONNECTED') || str.includes('DISCONNECT')) console.log(str);
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('✅ WebSocket conectado');
                this.isConnected = true;
                this._notificar('conectado');
                // Re-suscribir TODAS las suscripciones activas (también tras reconexión)
                this.activeSubscriptions.forEach(entry => {
                    entry.sub = this.stompClient.subscribe(entry.topic, entry.callback);
                });
            },
            onStompError: (frame) => {
                console.error('❌ Error STOMP:', frame.headers['message']);
                this._notificar('error');
            },
            onWebSocketClose: () => {
                console.log('🔌 WebSocket cerrado');
                this.isConnected = false;
                // Al reconectar onConnect volverá a registrar las suscripciones
                this.activeSubscriptions.forEach(entry => { entry.sub = null; });
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

        const id = ++this._subIdSeq;
        const entry = { id, topic, callback: wrapped, sub: null };
        this.activeSubscriptions.push(entry);

        if (this.isConnected && this.stompClient) {
            entry.sub = this.stompClient.subscribe(topic, wrapped);
        }

        return () => {
            this.activeSubscriptions = this.activeSubscriptions.filter(s => s.id !== id);
            try { entry.sub?.unsubscribe(); } catch { /* noop */ }
        };
    }

    desconectar() {
        this.connectionCount--;
        if (this.connectionCount <= 0 && this.stompClient) {
            this.stompClient.deactivate();
            this.isConnected = false;
            this.connectionCount = 0;
            this.activeSubscriptions = [];
            this._notificar('desconectado');
            console.log('👋 WebSocket desconectado');
        }
    }
}

export default new WebSocketService();
