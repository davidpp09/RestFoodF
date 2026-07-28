# Arquitectura del Frontend — RestFood

Guía práctica de cómo está organizado el código y **dónde tocar para cambiar cada cosa**.

## El flujo en una línea

```
Pantalla (pages/) → lógica (hooks/) → API (services/) → axios (api/) → backend :8080
```

Cada capa tiene un solo trabajo:

| Carpeta | Qué hace | Regla |
|---|---|---|
| `src/pages/` | Las pantallas. Una carpeta por área (Mesas, cocina, entregas, personal, reportes, dev). Arman la UI y conectan los hooks. | Nunca llaman a `api.get(...)` directo — siempre a través de un service. |
| `src/hooks/` | Lógica reutilizable con estado: cargar datos, carrito, websocket. `useMesaCart` es el carrito, `useAuth` la sesión. | Un hook = una responsabilidad. |
| `src/services/` | Todas las llamadas HTTP al backend, agrupadas por recurso (`productoService`, `mesaService`, `ordenService`...). | Si agregas un endpoint nuevo en el backend, su llamada va aquí. |
| `src/api/axiosConfig.js` | El cliente axios. Mete el token JWT a cada petición y, si el backend responde 401/403, borra la sesión y te manda a /login. | Casi nunca lo tocas. |
| `src/components/` | Piezas visuales compartidas. `mesaMesero/` es el conjunto mesa/orden/menú, `ui/` son los básicos (button, dialog, alert-dialog...). | |
| `src/constants/` | Roles y el menú lateral por rol (`menuConfig.js`). | |
| `src/lib/` | `authStorage.js` (la sesión en localStorage, llave `sesion_restfood`) y utilidades. | |

## "Quiero cambiar X" → toca Y

- **Agregar una pantalla nueva**: crea `src/pages/tuarea/TuPanel.jsx`, agrégala como `<Route>` en `src/App.jsx` dentro de un `<ProtectedRoute roleRequired={...}>`, y ponla en el menú en `src/constants/menuConfig.js`.
  ⚠️ Si la ruta también existe en el backend (como pasó con `/admin`), hay que dar de alta la ruta exacta del API en `/etc/caddy/Caddyfile` — si no, Caddy manda la página al backend y sale el error de "no token".
- **Cambiar qué rol ve qué**: `src/constants/roles.js` y los `roleRequired` en `App.jsx`. El destino al que llega cada rol tras el login lo decide el **backend** (campo `destino`).
- **Cambiar textos/estilos de una pantalla**: directo en su archivo bajo `pages/`. Los estilos son clases de Tailwind en el propio JSX.
- **Cambiar cómo se ve una mesa / el menú de platillos / la orden**: `src/components/mesaMesero/` (MesaCard = el cuadrito de la mesa, MesaMenu = lista de platillos, MesaOrden = el carrito, MesaDialogContent = arma todo). Los colores por turno están en `mesaMesero/constants.js` (`TEMAS_MESA`).
- **Agregar un campo a platillos**: backend primero; luego `services/productoService.js` (si cambia el payload), `pages/dev/FormPlatilloDialog.jsx` (el formulario) y la tabla en `pages/dev/DevPanel.jsx`.
- **Los popups de confirmación** ("¿Eliminar?", "¿Cancelar mesa?"): todos usan `components/ui/alert-dialog.jsx` con fondo `bg-slate-900`. Copia cualquiera de los existentes (hay uno en `DevPanel.jsx`) como plantilla.
- **Tiempo real (websocket)**: `services/websocketService.js` maneja la conexión STOMP y las re-suscripciones. Las pantallas se suscriben a topics (`/topic/cocina`, `/topic/mesas`) vía `websocketService.subscribe(...)` dentro de un `useEffect`.
- **Login/sesión**: `hooks/useAuth.js` + `lib/authStorage.js`. El token vive en localStorage.

## Deploy

```bash
./deploy/deploy-frontend.sh     # publica en producción
./deploy/rollback-frontend.sh   # vuelve a la release anterior
```

`npm run build` **solo compila**: escribe en el `dist/` del repo, que no lo sirve
nadie. Publicar es otra cosa — el script copia el build a una release con fecha y
sha en `~/deploys/restfood-frontend/releases/` y mueve el symlink `current`, que
es lo que Caddy sirve. Mover un symlink es atómico y no hay que recargar Caddy.

Hasta el 2026-07-28 Caddy servía el `dist/` del repo directo, así que compilar y
publicar eran el mismo acto: probar un build tiraba a producción lo que hubiera en
el árbol de trabajo, y no había versión anterior a la que volver porque el build
la había sobrescrito.

La tablet cachea fuerte: después de un deploy, pull-to-refresh en Fully Kiosk para
ver el cambio (el `index.html` se sirve con `no-cache`, así que basta una recarga).

## Notas

- `hooks/useCancelaciones.js` está **disponible pero sin pantalla**: carga el reporte de cancelaciones por mesero (`/admin/cancelaciones`) listo para cuando se construya esa vista. No confundir con *cancelar una mesa*, que vive en `MesaDialogContent` → `onOrdenCancelada`.
- `components/DataTable.jsx`, `StatCard.jsx`, `MesaAdmin.jsx`, `EntregaAdmin.jsx`, `WsIndicador.jsx`, `ImpresionTickets.jsx` son piezas del panel admin.
- **Panel admin dividido**: `AdminPanel.jsx` muestra dos mitades — mesas (`useMesasSala`) y pedidos para llevar en vivo (`hooks/useEntregasVivo.js`, que recarga `/ordenes/entregas/hoy` cuando llega algo por `/topic/cocina` o `/topic/tickets`, con un retraso de 600 ms porque el aviso WS puede ganarle a la transacción del backend). `EntregaAdmin.jsx` es la tarjeta de solo lectura.
- **Menú de navegación**: es un cajón desplegable en `RestLayout.jsx` — botón ☰ en el header lo abre como overlay; se cierra al navegar o tocar el fondo. El rol MESERO no tiene menú.
- Vertical vs horizontal en la tablet: las clases `portrait:` / `landscape:` de Tailwind controlan qué se ve; en vertical los paneles de mesa/entrega alternan entre "menú" y "orden" con el estado `vista`.
