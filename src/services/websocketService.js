import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.isConnected = false;
        this.pendingSubscriptions = [];
        this.connectionCount = 0;
    }

    conectar(token) {
        this.connectionCount++;

        // Si ya está activo, no crear otra conexión
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
                this.pendingSubscriptions.forEach(({ topic, callback }) => {
                    this.stompClient.subscribe(topic, callback);
                });
                this.pendingSubscriptions = [];
            },
            onStompError: (frame) => console.error('❌ Error STOMP:', frame.headers['message']),
            onWebSocketClose: () => {
                console.log('🔌 WebSocket cerrado');
                this.isConnected = false;
            }
        });

        this.stompClient.activate();
    }

    // Suscribirse a un topic independientemente
    subscribe(topic, callback) {
        const wrapped = (message) => {
            try {
                callback(JSON.parse(message.body));
            } catch (error) {
                console.error(`❌ Error procesando mensaje de ${topic}:`, error);
            }
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
            this.pendingSubscriptions = []; // limpiar para evitar suscripciones duplicadas al reconectar
            console.log('👋 WebSocket desconectado');
        }
    }
}

export default new WebSocketService();
