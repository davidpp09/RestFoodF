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
            debug: (str) => { console.log("STOMP Debug:", str); },
            reconnectDelay: 5000,

            onConnect: () => {
                console.log('✅ ¡CONEXIÓN EXITOSA!');

                // ✅ Nos suscribimos al topic de mesas
                this.stompClient.subscribe('/topic/mesas', (message) => {
                    const mesaActualizada = JSON.parse(message.body);
                    console.log('📡 Mesa actualizada:', mesaActualizada);
                    onMesaActualizada(mesaActualizada); // 🔔 Le avisamos al AdminPanel
                });
            },

            onStompError: (frame) => {
                console.error('❌ Error de Broker:', frame.headers['message']);
            }
        });

        this.stompClient.activate();
    }

    desconectar() {
        if (this.stompClient) this.stompClient.deactivate();
    }
}

export default new WebSocketService();