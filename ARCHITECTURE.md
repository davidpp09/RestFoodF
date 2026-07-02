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
npm run build     # genera dist/, Caddy lo sirve directo — no hay que reiniciar nada
```

La tablet cachea fuerte: después de un build, pull-to-refresh en Fully Kiosk para ver el cambio.

## Notas

- `hooks/useCancelaciones.js` está **disponible pero sin pantalla**: carga el reporte de cancelaciones por mesero (`/admin/cancelaciones`) listo para cuando se construya esa vista. No confundir con *cancelar una mesa*, que vive en `MesaDialogContent` → `onOrdenCancelada`.
- `components/DataTable.jsx`, `StatCard.jsx`, `MesaAdmin.jsx`, `WsIndicador.jsx`, `ImpresionTickets.jsx` son piezas del panel admin.
- Vertical vs horizontal en la tablet: las clases `portrait:` / `landscape:` de Tailwind controlan qué se ve; en vertical los paneles de mesa/entrega alternan entre "menú" y "orden" con el estado `vista`.
