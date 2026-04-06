import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.stompClient = null;
    }

    // Método para encender la radio y sintonizar el canal
    conectar(onMensajeRecibido) {
        // Configuramos el cliente STOMP
        this.stompClient = new Client({
            // 🔌 Aquí va la URL de tu backend (ajusta el puerto si es distinto a 8080)
            webSocketFactory: () => new SockJS('http://localhost:8080/ws-restfood'), 
            reconnectDelay: 5000, // Intenta reconectar cada 5 segundos si el WiFi falla
            
            onConnect: () => {
                console.log('¡Conectado al servidor WebSocket! 📻');
                
                // 🎧 Sintonizamos el canal exclusivo del Admin
                this.stompClient.subscribe('/topic/mesas', (mensaje) => {
                    const datos = JSON.parse(mensaje.body);
                    onMensajeRecibido(datos); // Le pasamos los datos a React
                });
            },
            onStompError: (frame) => {
                console.error('Error de Broker: ' + frame.headers['message']);
            }
        });

        // Activamos la conexión
        this.stompClient.activate();
    }

    // Método para apagar la radio cuando salgamos de la pantalla
    desconectar() {
        if (this.stompClient !== null) {
            this.stompClient.deactivate();
        }
        console.log("Desconectado del WebSocket");
    }
}

// Exportamos una única instancia para usarla en cualquier parte
const websocketService = new WebSocketService();
export default websocketService;