# RestFood — Frontend

Interfaz web del sistema. Corre en tablets para meseros, en una pantalla grande para cocina y en una PC para admin/caja. Construida con React 19 + Vite + Tailwind + shadcn/ui.

Todas las pantallas son reactivas (lo que pasa en una tablet aparece en la pantalla de cocina en el mismo segundo) y están pensadas para ser operadas con los dedos, rápido, con el menor número de toques posible.

---

## Filosofía de la interfaz

- **Oscura por default.** En un restaurante las luces pueden ser tenues y las pantallas deslumbran. Fondos `slate-900` reducen la fatiga visual después de 8 horas de turno.
- **Tipografía grande y bold.** Un mesero que lee una comanda a metro y medio tiene que poder identificar la mesa sin forzar la vista.
- **Colores semánticos consistentes.** Naranja = acción principal / turno comida. Cian = turno desayuno. Verde = OK. Rojo = error/cancelación. El cerebro aprende el código en minutos.
- **Cero navegación profunda.** Todo lo que un mesero necesita está a un tap desde la pantalla de mesas. No hay submenús de submenús.

---

## Stack

| Herramienta | Para qué |
|---|---|
| **React 19 + Vite** | UI declarativa + dev server con HMR brutalmente rápido |
| **Tailwind CSS 4** | Estilos inline sin salir del componente |
| **shadcn/ui + Radix** | Primitivas accesibles (Dialog, DropdownMenu, Tabs) sin lock-in de librería |
| **Axios** | Cliente HTTP con interceptores para JWT y manejo global de 401 |
| **@stomp/stompjs + SockJS** | WebSocket STOMP con fallback para redes hostiles |
| **React Router DOM 7** | Routing cliente |
| **Recharts** | Gráficas del panel de reportes |
| **TanStack Table** | Tablas de personal / cancelaciones con orden y filtro |
| **Sonner** | Toasts (success / error / info) |
| **Lucide** | Iconos (ligeros, consistentes) |

---

## Requisitos

- Node.js 18+ (probado en 20)
- npm (o pnpm si prefieres)
- Backend RestFood corriendo y accesible desde la red del frontend

---

## Configuración

Crea `.env.local` en la raíz de `RestFoodF/`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

En producción (dentro de la LAN del restaurante) normalmente es la IP fija del servidor, por ejemplo `http://192.168.1.50:8080`.

El WebSocket usa la misma base URL (cambia `http` por `ws` internamente), así que no hace falta configurar el WS por separado.

---

## Levantarlo

```bash
cd RestFoodF
npm install
npm run dev
```

Queda en `http://localhost:5173`.

Para build de producción:

```bash
npm run build     # genera dist/
npm run preview   # sirve el build localmente para probar
```

La carpeta `dist/` es estática: la sirves con Nginx, Caddy, IIS, o incluso desde el mismo Spring Boot si quisieras.

---

## Cómo navega un usuario

```mermaid
flowchart TD
    Login[/login/] -->|backend responde con destino| Decide{rol}
    Decide -->|MESERO| Mesero[/mesero/<br/>tarjetas de mesas de su seccion]
    Decide -->|COCINA| Cocina[/cocina-panel/<br/>grid de tickets en vivo]
    Decide -->|ADMIN o DEV| Admin[/admin/<br/>todas las mesas de la sala]
    Decide -->|CAJERO| AdminCajero[/admin/<br/>solo lectura de mesas]
    Decide -->|REPARTIDOR| Entregas[/entregas/<br/>pedidos para llevar]

    Admin --> Personal[/admin/personal/]
    Admin --> Reportes[/admin/reportes/]
    Admin --> Platillos[/admin/platillos/<br/>solo DEV]
    Entregas --> Historial[/entregas/historial/]
    Entregas --> Dia[/entregas/dia/]
```

La decisión de a qué ruta mandar al usuario tras el login **no la hace el frontend**: el backend devuelve un campo `destino` en la respuesta de `/login`, y el frontend solo navega ahí. Así si cambian los permisos de un rol, no hay que tocar código en dos repos.

---

## Estructura del proyecto

```
src/
├── api/
│   └── axiosConfig.js         # instancia Axios + interceptores JWT/401
├── components/                 # Reutilizables
│   ├── ProtectedRoute.jsx      # guard por rol
│   ├── AuthRedirect.jsx        # redirige segun sesion
│   ├── RestLayout.jsx          # layout principal con sidebar
│   ├── WsIndicador.jsx         # estado WebSocket en header
│   ├── DataTable.jsx           # tabla reutilizable (TanStack)
│   ├── MesaAdmin.jsx           # tarjeta de mesa en panel admin
│   └── mesaMesero/             # sub-componentes del panel mesero
├── constants/
│   ├── roles.js                # ROLES y SUPER_ROLES
│   └── menuConfig.js           # sidebar segun rol
├── hooks/                      # Toda la logica no-UI vive aqui
├── lib/
│   ├── authStorage.js          # API centralizada sobre localStorage
│   └── utils.js
├── pages/                      # Una carpeta por area funcional
│   ├── Mesas/                  # mesero
│   ├── cocina/
│   ├── entregas/
│   ├── personal/
│   ├── reportes/
│   └── dev/
├── services/                   # Clientes HTTP (uno por dominio)
├── App.jsx                     # Definicion de rutas
└── main.jsx
```

**Regla de separación**: un `service` solo hace HTTP, un `hook` tiene lógica (estado + efectos + WS), una `page` compone hooks y componentes y *no* llama a Axios directamente.

---

## Sesión y autenticación

### `authStorage.js` — la capa encima de `localStorage`

Antes cada archivo leía/escribía `localStorage` con su propia key. Era un desastre para rastrear. Ahora hay un único módulo con una API limpia:

```javascript
authStorage.guardar({ jwTtoken, rol, nombre, id_usuarios, seccion, destino })
authStorage.leer()       // { token, rol, nombre, id, seccion, destino } | null
authStorage.actualizar({ ... }) // merge parcial
authStorage.limpiar()    // logout

// Accesos directos
authStorage.token()
authStorage.rol()
authStorage.idUsuario()
authStorage.seccion()
authStorage.destino()
```

### `useAuth.js`

- `loginUser(email, password)` — POST `/login`, guarda todo en `authStorage`, navega al `destino` que devolvió el backend.
- `logOut()` — limpia storage y redirige a `/login`.
- `verifyLogin()` — pega a `/usuarios/me`. Si el backend contesta 401 (token expirado o revocado), el interceptor de Axios redirige al login automáticamente. Se ejecuta al arrancar la app, al volver a la pestaña (focus) y cada 5 minutos.

### `ProtectedRoute.jsx`

Guardia de ruta que recibe `roleRequired={[...]}`. Lee el rol desde `authStorage` (no decodifica el JWT en el cliente — el backend ya dio el rol en la respuesta de login). Si no hay sesión, redirige a `/login`. Si hay sesión pero el rol no coincide, muestra `AccessDenied`.

### `axiosConfig.js`

- **Base URL** desde `VITE_API_BASE_URL`.
- **Request interceptor**: inyecta `Authorization: Bearer <token>` si hay sesión.
- **Response interceptor**: si el backend contesta 401 o 403, limpia `authStorage` y redirige a `/login` — pero solo si no estabas ya en `/login` (evita loops).

### Persistencia de sesión

El token vive en `localStorage`. Sobrevive a cerrar y abrir el navegador, y a reinicios de la tablet. Se invalida de tres formas:

1. El usuario hace logout manual.
2. El token expira (el backend contesta 401 en la siguiente request).
3. Otro usuario loguea en el mismo dispositivo (sobreescribe la sesión).

---

## WebSocket

### `websocketService.js` — singleton

```javascript
websocketService.conectar(token)
websocketService.subscribe(topic, callback)  // retorna funcion para desuscribir
websocketService.desconectar()
websocketService.onStatusChange(fn)          // conectado | reconectando | error | desconectado
```

Puntos finos:

- **Una sola conexión por pestaña.** No importa cuántos hooks se suscriban; todos comparten el mismo socket.
- **Re-suscripción automática.** Si la conexión se cae y se recupera, todas las suscripciones activas se vuelven a registrar con el broker. Esto era un bug que arreglé: antes, al reconectar, el cliente no recibía los eventos hasta recargar la página.
- **Backoff exponencial.** Si el backend está caído, no satura la red intentando cada milisegundo.

### Topics y quién los escucha

| Topic | Qué llega | Hook que lo consume |
|---|---|---|
| `/topic/mesas` | Estado de mesa (LIBRE/OCUPADA) | `useMesasSala` (admin), `useMesas` (mesero) |
| `/topic/cocina` | Tickets de cocina nuevos/modificados/cancelados | `PedidosPanel` (cocina) |
| `/topic/tickets` | Ticket de cliente listo | `useMesasSala` → notificación toast |

### `WsIndicador.jsx`

Pequeño indicador en la esquina superior derecha con el estado del socket. Verde = conectado. Amarillo = reconectando. Rojo = desconectado / error. No bloquea la UI; es informativo.

---

## Pantallas (qué hace cada una)

### `/login`

Formulario simple con email + contraseña. Tema oscuro, acentos naranjas. Toggle para mostrar contraseña. Tras un login exitoso, navega al `destino` que dictó el backend.

### `/mesero` — panel del mesero

```mermaid
flowchart LR
    inicio[Abre panel] --> carga[Carga mesas de su seccion<br/>GET /mesas/rango/inicio/fin]
    carga --> grid[Grid de tarjetas de mesa]
    grid --> click{Click en mesa}
    click -->|LIBRE| abrir[Elige turno<br/>POST /ordenes]
    click -->|OCUPADA| dialog[Abre dialog<br/>menu + carrito]
    dialog --> guarda[Guardar comanda<br/>POST /ordendetalles]
    dialog --> cerrar[Cerrar cuenta<br/>PUT /ordenes/id/cerrar]
    guarda -.broadcast.-> grid
    cerrar -.broadcast.-> grid
```

- Cada mesero solo ve su sección (10 mesas). La sección la dicta el JWT al login.
- El diálogo tiene dos zonas: menú izquierda (con tabs por categoría), carrito derecha.
- Cada item del carrito tiene cantidad editable y campo de comentarios.
- El botón cambia: **"ENVIAR ORDEN"** (verde) la primera vez que se envía la comanda completa, **"MODIFICAR"** (naranja/amber) en envíos posteriores. Esto ayuda al mesero a saber si ya mandó a cocina o si está modificando un pedido vivo.
- El carrito persiste en `localStorage` por `id_orden`. Si el mesero cierra la tablet por accidente, al volver a abrirla sigue viendo lo que había capturado.

### `/cocina-panel` — pantalla de cocina

- `GET /cocina` al entrar + suscripción a `/topic/cocina` para actualizaciones en vivo.
- Grid de tickets (cards grandes) con número de comanda, mesa o "PARA LLEVAR", y cada platillo con cantidad, nombre y comentario.
- Estado visual por platillo: NUEVO (neutral), MODIFICADO (amarillo), CANCELADO (rojo tachado), REENVIO (azul).
- Botón "MARCAR LISTO" → `PATCH /cocina/{id}/servido`. Al marcarlo, el ticket desaparece del grid.

Los `console.log` del handler de cocina están adrede: ayudan a depurar en vivo si algo no aparece.

### `/admin` — panel general

- `useMesasSala()` carga todas las mesas de la sala y las mantiene en vivo con `/topic/mesas`.
- Tarjetas de estadística arriba: total / ocupadas / libres.
- Grid con una tarjeta `MesaAdmin` por mesa. Cada una muestra estado, mesero asignado y platillos actuales.
- Cuando se cierra una cuenta, aparece un toast discreto con el total del ticket.

### `/admin/personal`

- `usePersonal()` + `DataTable` de TanStack.
- Columnas: nombre, email, rol, sección.
- Acciones por fila: Editar / Eliminar (soft delete).
- Dialog de crear empleado con validación client-side + backend.

### `/admin/reportes`

- Selector de fecha con atajos "Hoy" / "Ayer".
- KPIs arriba: total general, total desayuno, total comida, cantidad de platillos loza vs llevar.
- Tres gráficas con Recharts:
  - **Ventas por empleado** (barras horizontales)
  - **Servicios** (donut: desayuno vs comida)
  - **Tipos de pedido** (donut: LOZA vs LLEVAR)
- Tabla de cancelaciones con mesero, platillo, cantidad e importe.

### `/admin/platillos` — solo DEV

CRUD del menú: crear, editar, eliminar productos. Campos: nombre, precio comida, precio desayuno, disponibilidad, categoría. El backend valida el máximo de 7 platillos por categoría (si intentas crear el octavo, regresa 400).

### `/entregas` — repartidor

Flujo para pedidos "para llevar" (sin mesa). Similar al panel del mesero pero sin grid de mesas: es directo al menú + carrito. Al cerrar, el ticket se imprime como LLEVAR.

Sub-rutas:

- `/entregas/historial` — órdenes LLEVAR cerradas del día.
- `/entregas/dia` — activar/desactivar platillos para hoy y ajustar precio del día.

---

## Hooks clave

| Hook | Qué hace |
|---|---|
| `useAuth` | login/logout/verifyLogin/info de usuario |
| `useMesas(inicio, fin)` | carga mesas de una sección + WS `/topic/mesas` |
| `useMesasSala` | admin: todas las mesas + `/topic/mesas` + `/topic/tickets` |
| `useMesaCart(idOrden, turno)` | carrito persistido en localStorage; sincroniza con `POST /ordendetalles` |
| `useProductos` | catálogo con categorías |
| `usePersonal` | lista de usuarios con `recargar()` tras mutaciones |
| `useReportes` | corte del día + cancelaciones, con selector de fecha |
| `useTickets` | estado de tickets pendientes de imprimir |
| `useWsStatus` | expone el estado del socket para `WsIndicador` |

---

## Servicios (clientes HTTP)

Cada servicio es un objeto con funciones que mapean 1:1 a endpoints del backend. Nada más.

| Servicio | Endpoints que toca |
|---|---|
| `authService` | `/login`, `/usuarios/me` |
| `mesaService` | `/mesas`, `/mesas/rango/...`, `/ordenes` (abrir) |
| `ordenService` | `/ordenes`, `/ordendetalles`, `/ordenes/{id}/cerrar`, `/ordenes/entregas/hoy` |
| `cocinaService` | `/cocina`, `/cocina/{id}/servido` |
| `productoService` | `/productos`, `/productos/{id}/dia` |
| `usuarioService` | `/usuarios` (CRUD), `/usuarios/activar/{id}` |
| `adminService` | `/admin`, `/admin/cancelaciones` |

---

## Convenciones de código

- **Nombres en español** donde coincide con el dominio (`mesa`, `orden`, `platillo`). Hooks y componentes en inglés/camelCase porque es lo idiomático de React.
- **Un archivo por componente**. Si un archivo pasa de ~250 líneas, toca partirlo.
- **Estado local con `useState`** para cosas simples. No hay Redux ni Zustand; la app no lo necesita y agregar otra librería sería ruido.
- **Toast al éxito y al error.** Nunca dejamos una mutación "silenciosa". Si guardaste algo, el usuario tiene que verlo confirmado.

---


## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_BASE_URL` | URL base del backend (REST + WS) | `http://192.168.1.50:8080` |

Todas las variables que usa Vite deben empezar con `VITE_` para que lleguen al bundle.

---


| WS no conecta, log `Unauthorized` | Token expiró o no se está mandando | Revisa que `authStorage.token()` devuelva algo en DevTools |
| La cocina no ve los pedidos nuevos | Re-suscripción falló tras reconexión | Ya debería estar arreglado; si vuelve a pasar, recargar la página |
| El carrito del mesero quedó "pegado" con datos viejos | `localStorage` del carrito quedó sucio | En DevTools → Application → Local Storage → borra la key del carrito de esa orden |
