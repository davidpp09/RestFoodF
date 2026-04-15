# 💻 RestFood Frontend - Panel de Control Moderno

Interfaz de usuario moderna, rápida y reactiva para la gestión integral de un restaurante. Diseñada para funcionar en desktops y tablets.

## 🎨 Características Principales
*   **Panel de Mesas:** Gestión visual de ocupación y pedidos en tiempo real.
*   **Panel de Cocina:** Recepción inmediata de pedidos mediante WebSockets.
*   **Panel Administrativo:** Control total de productos, categorías y personal.
*   **Reportes Dinámicos:** Gráficas de ventas y rendimiento de empleados.
*   **Gestión de Entregas:** Control de platillos del día y estados de entrega.

## ⚡ Tecnologías Utilizadas
*   **React (Vite)**
*   **Tailwind CSS:** Diseño moderno y responsivo.
*   **Shadcn UI:** Componentes de interfaz de alta calidad.
*   **Axios:** Comunicación con la API.
*   **Lucide React:** Iconografía profesional.
*   **SockJS & STOMP:** Comunicación bidireccional en tiempo real.
*   **Sonner:** Notificaciones interactivas.

## ⚙️ Configuración
1.  Crea un archivo `.env` en la raíz del proyecto.
2.  Define la URL de tu API:
    ```env
    VITE_API_BASE_URL=http://localhost:8080
    ```

## 🚀 Instalación y Ejecución
1.  Instala las dependencias:
    ```bash
    npm install
    ```
2.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

## 📱 Notas de Despliegue
El frontend es agnóstico al entorno. Al cambiar la URL en el archivo `.env`, tanto las peticiones HTTP como la conexión de WebSockets se ajustarán automáticamente al nuevo servidor.
