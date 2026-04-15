# RestFood Frontend - Panel de Control

Interfaz moderna para la gestión integral de un restaurante. Diseñada para desktop y tablet.

## Tecnologías

- **React + Vite**
- **Tailwind CSS** — diseño responsivo
- **Shadcn UI** — componentes de interfaz
- **Axios** — comunicación con la API
- **Lucide React** — iconografía
- **SockJS + STOMP** — WebSockets en tiempo real
- **Sonner** — notificaciones toast

## Paneles por rol

| Panel | Rol | Descripción |
|-------|-----|-------------|
| Mesas | Mesero | Gestión visual de mesas, envío de órdenes a cocina, cobro |
| Cocina | Cocina | Recepción de comandas en tiempo real |
| Reportes | Admin/Dev | Ventas por día, empleado, servicios y cancelaciones |
| Personal | Admin/Dev | Alta y gestión de usuarios |
| Productos | Admin/Dev | Catálogo de platillos y categorías |
| Entregas | Repartidor | Órdenes para llevar del día |

## Funciones del panel de mesero

- Abrir mesa, agregar/modificar/cancelar platillos
- Enviar comanda a cocina (imprime físicamente en impresora de cocina)
- **Reenviar a cocina** — manda la orden completa marcada como reenvío (útil si falla la impresora)
- Cerrar y cobrar — genera ticket de cliente en pantalla e imprime físicamente

## Reportes

Los reportes filtran por fecha (Hoy / Ayer / fecha personalizada) y muestran:
- Total general, desayuno y comida
- Ventas por empleado
- Distribución de servicios y tipo de pedido
- Cancelaciones del día por mesero con detalle de platillos

## Configuración

Crea un archivo `.env` en la raíz:

```env
VITE_API_BASE_URL=http://localhost:8080
```

La URL aplica automáticamente tanto a peticiones HTTP como a la conexión WebSocket.

## Instalación

```bash
npm install
npm run dev
```
