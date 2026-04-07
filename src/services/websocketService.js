import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.stompClient = null;
    }

    conectar(token, onMesaActualizada) {
        this.stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws-restfood'),
            connectHeaders: {
                'Authorization': `Bearer ${token}`
            },
            // 🔒 Debug limpio: Solo muestra eventos importantes sin filtrar el token
            debug: (str) => {
                if (str.includes('CONNECTED') || str.includes('DISCONNECT')) {
                    console.log("🌐 WS Status:", str);
                }
            },
            reconnectDelay: 5000,

            onConnect: () => {
                console.log('✅ ¡SISTEMA EN VIVO CONECTADO!');

                // 🔔 Suscripción al canal de mesas
                this.stompClient.subscribe('/topic/mesas', (message) => {
                    try {
                        const mesaActualizada = JSON.parse(message.body);
                        onMesaActualizada(mesaActualizada);
                    } catch (error) {
                        console.error("❌ Error al procesar mensaje de mesa:", error);
                    }
                });
            },

            onStompError: (frame) => {
                console.error('❌ Error de Broker:', frame.headers['message']);
            },

            onWebSocketClose: () => {
                console.log('🔌 Conexión de WebSocket cerrada');
            }
        });

        this.stompClient.activate();
    }

    desconectar() {
        if (this.stompClient) {
            this.stompClient.deactivate();
            console.log('👋 Desconectado del servicio de tiempo real');
        }
    }
}

export default new WebSocketService();