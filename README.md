# RestFood — Frontend

Interfaz web para sistema de restaurante construida con **React 19 + Vite**. Incluye panel de meseros, cocina en tiempo real, gestión de entregas, administración de personal y reportes con gráficas.

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.2.4 | Framework UI |
| Vite | 8.0.1 | Build tool y dev server |
| Tailwind CSS | 4.2.2 | Estilos |
| shadcn/ui + Radix | — | Componentes accesibles |
| Axios | 1.14.0 | Cliente HTTP con interceptores JWT |
| @stomp/stompjs | 7.3.0 | WebSocket STOMP |
| SockJS-client | — | Fallback WebSocket |
| React Router DOM | 7.13.2 | Routing |
| Recharts | 3.8.1 | Gráficas de reportes |
| TanStack Table | 8.21.3 | Tablas con filtros/ordenamiento |
| jwt-decode | 4.0.0 | Decodificar claims del token |
| Sonner | 2.0.7 | Toast notifications |
| Lucide React | — | Iconos |
| next-themes | 0.4.6 | Soporte dark mode |

---

## Requisitos

- Node.js 18+
- npm o pnpm
- Backend RestFood corriendo

---

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## Levantar el proyecto

```bash
cd RestFoodF
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

---

## Estructura del proyecto

```
src/
├── api/
│   └── axiosConfig.js           # Instancia Axios + interceptor JWT
├── components/
│   ├── ProtectedRoute.jsx        # Guard de rutas por rol
│   ├── AuthRedirect.jsx          # Redirige si no hay sesión
│   ├── RestLayout.jsx            # Layout principal con sidebar
│   ├── AccessDenied.jsx          # Página 403
│   ├── DataTable.jsx             # Tabla reutilizable (TanStack Table)
│   ├── StatCard.jsx              # Tarjeta de estadística
│   ├── WsIndicador.jsx           # Indicador de estado WebSocket
│   ├── MesaAdmin.jsx             # Tarjeta de mesa en panel admin
│   ├── ImpresionTickets.jsx      # Modal de impresión de ticket
│   └── mesaMesero/               # Componentes de mesa para mesero
│       ├── MesaMesero.jsx        # Tarjeta de mesa del mesero
│       ├── MesaCard.jsx          # Variante de tarjeta
│       ├── MesaAbrirOrden.jsx    # Formulario abrir orden nueva
│       ├── MesaMenu.jsx          # Menú de productos por categoría
│       ├── MesaOrden.jsx         # Resumen de orden actual
│       ├── MesaDialogContent.jsx # Contenido del dialog de mesa
│       ├── MesaDialogHeader.jsx  # Header del dialog
│       ├── TiemposSection.jsx    # Sección de tiempos de orden
│       └── constants.js          # Colores y configuración de UI
├── constants/
│   ├── roles.js                  # Definición de roles y grupos
│   └── menuConfig.js             # Configuración de navegación sidebar
├── hooks/
│   ├── useAuth.js                # Login, logout, JWT claims
│   ├── useMesas.js               # Cargar mesas por rango de sección
│   ├── useMesasSala.js           # Admin: todas las mesas + WS
│   ├── useMesaCart.js            # Carrito de orden (localStorage)
│   ├── useProductos.js           # Cargar productos con categorías
│   ├── usePersonal.js            # Cargar usuarios / personal
│   ├── useReportes.js            # Corte del día y cancelaciones
│   ├── useTickets.js             # Estado de tickets para impresión
│   ├── useCancelaciones.js       # Datos de cancelaciones por mesero
│   ├── useTiempos.js             # Tiempos de orden
│   ├── useFormEmpleado.js        # Estado de formularios de empleados
│   └── useWsStatus.js            # Estado de conexión WebSocket
├── pages/
│   ├── Login.jsx
│   ├── AdminPanel.jsx
│   ├── Mesas/
│   │   └── MeseroPanel.jsx
│   ├── cocina/
│   │   └── PedidosPanel.jsx
│   ├── entregas/
│   │   ├── EntregasPanel.jsx
│   │   ├── HistorialPanel.jsx
│   │   └── PlatillosDiaPanel.jsx
│   ├── personal/
│   │   ├── PersonalPanel.jsx
│   │   ├── FormularioNuevoEmpleado.jsx
│   │   ├── FormularioEditarEmpleado.jsx
│   │   ├── DialogEliminar.jsx
│   │   └── columns.jsx
│   ├── reportes/
│   │   ├── ReportesPanel.jsx
│   │   ├── GraficaVentasEmpleados.jsx
│   │   ├── GraficaServicios.jsx
│   │   └── GraficaTiposPedido.jsx
│   └── dev/
│       └── DevPanel.jsx
├── services/
│   ├── authService.js
│   ├── mesaService.js
│   ├── ordenService.js
│   ├── cocinaService.js
│   ├── productoService.js
│   ├── usuarioService.js
│   ├── adminService.js
│   └── websocketService.js
├── lib/
│   └── utils.js
├── App.jsx                       # Definición de rutas
└── main.jsx                      # Entry point
```

---

## Autenticación

### `useAuth.js`

Maneja toda la sesión del usuario.

```javascript
loginUser(email, password)   // POST /login → guarda token en sessionStorage
logOut()                     // Borra token y redirige a /login
verifyLogin()                // Verifica expiración del JWT
roleLog()                    // Retorna el rol del usuario (ADMIN, MESERO, etc.)
getUsuarioId()               // Retorna el ID del usuario del token
getSeccion()                 // Retorna la sección asignada al mesero
```

**Token:** se guarda en `sessionStorage` con la clave `token_restfood`.

**Claims del JWT decodificados:**
- `id` — ID del usuario
- `email` — Correo
- `role` — Rol (ADMIN, DEV, MESERO, COCINA, CAJERO, REPARTIDOR)
- `seccion` — Número de sección del mesero
- `exp` — Expiración

### `ProtectedRoute.jsx`

Componente guard que envuelve cada ruta. Recibe `roleRequired[]` y redirige a `/login` si el usuario no tiene sesión, o muestra `AccessDenied` si no tiene el rol requerido.

### `axiosConfig.js`

Instancia de Axios preconfigurada:
- **Base URL:** `import.meta.env.VITE_API_BASE_URL`
- **Request interceptor:** inyecta `Authorization: Bearer <token>` en cada request
- **Response interceptor:** en 401/403 hace logout automático y redirige a `/login`

---

## Rutas de la aplicación

```
/login                              Pública — Login
/admin                              ADMIN, DEV — Panel de todas las mesas
/admin/personal                     ADMIN, DEV — Gestión de personal
/admin/reportes                     ADMIN, DEV — Reportes y gráficas
/admin/platillos                    DEV — Gestión de productos (solo DEV)
/mesero                             MESERO, ADMIN, DEV — Panel de sección del mesero
/cocina-panel                       COCINA, ADMIN, DEV — Pantalla de cocina
/entregas                           REPARTIDOR, ADMIN, DEV — Órdenes para llevar
/entregas/historial                 REPARTIDOR, ADMIN, DEV — Historial de entregas
/entregas/dia                       REPARTIDOR, ADMIN, DEV — Platillos del día
```

---

## Páginas y funcionalidades

### Login (`/login`)
- Formulario de email y contraseña
- Toggle mostrar/ocultar contraseña
- Tema oscuro con acentos naranjas
- Al autenticar, redirige según rol

---

### Panel Admin (`/admin`) — `AdminPanel.jsx`
- Hook: `useMesasSala()` — carga todas las mesas + escucha `/topic/mesas` y `/topic/tickets` via WebSocket
- Tarjetas de estadística: total de mesas, ocupadas, libres
- Grid de tarjetas `MesaAdmin` por mesa con estado en tiempo real
- Indicador de conexión WebSocket (`WsIndicador`)
- Modal `ImpresionTickets` se activa al recibir ticket por WebSocket

---

### Panel Mesero (`/mesero`) — `MeseroPanel.jsx`
- Hook: `useMesas(inicio, fin)` — carga mesas de la sección del mesero
- Sección calculada desde el JWT (`seccion`): 10 mesas por sección (e.g., sección 2 → mesas 11–20)
- Cada mesa muestra su estado (LIBRE / OCUPADA) con su mesero y platillos actuales
- Al clic en mesa LIBRE → formulario para abrir orden (seleccionar turno DESAYUNO/COMIDA)
- Al clic en mesa OCUPADA → dialog con:
  - Menú por categorías (`MesaMenu`) con tabs de categoría y lista de productos
  - Carrito con cantidades, comentarios por platillo
  - Botón guardar → `POST /ordendetalles` (sincroniza la comanda)
  - Botón cerrar orden → `PUT /ordenes/{id}/cerrar`
- Carrito persiste en `localStorage` por `id_orden` (sobrevive recarga de página)

---

### Panel Cocina (`/cocina-panel`) — `PedidosPanel.jsx`
- Carga órdenes pendientes al entrar: `GET /cocina`
- Escucha `/topic/cocina` via WebSocket para actualizaciones en tiempo real
- Cada ticket muestra:
  - Número de comanda y mesa / tipo (LOZA/LLEVAR)
  - Platillos con estado visual: NUEVO, MODIFICADO, CANCELADO, REENVIO
  - Comentarios del mesero por platillo
- Botón "Listo" → `PATCH /cocina/{id}/servido`
- No requiere recargar la página; las comandas llegan automáticamente

---

### Panel Entregas (`/entregas`) — `EntregasPanel.jsx`
- Flujo para órdenes tipo LLEVAR (para llevar / domicilio)
- Selector de turno (DESAYUNO / COMIDA) con colores diferenciados
- Menú de productos + carrito igual al panel de mesero
- Botón crear orden → `POST /ordenes` con `tipo: LLEVAR`
- Botón cerrar → `PUT /ordenes/{id}/cerrar`
- Carga historial de entregas del día: `GET /ordenes/entregas/hoy`

---

### Platillos del Día (`/entregas/dia`) — `PlatillosDiaPanel.jsx`
- Gestión de disponibilidad diaria de productos
- Activar/desactivar platillos para el día
- Actualizar precio del día (platillo del día a precio especial)
- Endpoints: `PATCH /productos/{id}/dia` y `PUT /productos/desactivar-dia/{categoriaId}`

---

### Gestión de Personal (`/admin/personal`) — `PersonalPanel.jsx`
- Hook: `usePersonal()` — lista todos los usuarios activos
- Tabla con TanStack Table (`DataTable`): nombre, email, rol, sección
- Columnas configuradas en `columns.jsx`
- Acciones por fila: Editar, Eliminar
- Modal crear empleado (`FormularioNuevoEmpleado`): nombre, email, contraseña, rol, sección (si es MESERO)
- Modal editar empleado (`FormularioEditarEmpleado`): nombre, email
- Dialog confirmar eliminación (`DialogEliminar`) → `DELETE /usuarios/{id}` (soft delete)
- Roles disponibles: ADMIN, MESERO, COCINA, CAJERO, REPARTIDOR

---

### Reportes (`/admin/reportes`) — `ReportesPanel.jsx`
- Hook: `useReportes()` — corte del día + cancelaciones
- Selector de fecha con botones rápidos "Hoy" y "Ayer"
- Tarjetas de resumen: total general, total desayuno, total comida, total platillos
- Gráficas con Recharts:
  - `GraficaVentasEmpleados` — ventas por mesero (barras)
  - `GraficaServicios` — desayuno vs comida (pie/donut)
  - `GraficaTiposPedido` — loza vs para llevar (pie/donut)
- Tabla de cancelaciones: mesero, platillo cancelado, cantidad, importe
- Endpoints: `GET /admin?fecha=YYYY-MM-DD` y `GET /admin/cancelaciones?desde=&hasta=`

---

### Gestión de Productos (`/admin/platillos`) — `DevPanel.jsx`
- Solo accesible con rol DEV
- CRUD completo de productos:
  - Crear: nombre, precio comida, precio desayuno, disponibilidad, categoría
  - Editar cualquier campo
  - Eliminar producto
- Endpoints: `POST/PUT/DELETE /productos`

---

## WebSocket

### `websocketService.js` (Singleton)

```javascript
conectar(token)              // Conecta al broker STOMP con JWT
subscribe(topic, callback)  // Suscribirse a un topic
desconectar()               // Cerrar conexión
onStatusChange(fn)          // Callback de cambios de estado
```

**Estados:** `conectado`, `reconectando`, `error`, `desconectado`

### Topics en uso

| Topic | Qué llega | Quién lo usa |
|---|---|---|
| `/topic/mesas` | Estado de mesa actualizado | `useMesasSala` (Admin), `useMesas` (Mesero) |
| `/topic/cocina` | Ticket de cocina nuevo/modificado | `PedidosPanel` (Cocina) |
| `/topic/tickets` | Ticket de cliente listo para imprimir | `useMesasSala` → `ImpresionTickets` |

### `WsIndicador.jsx`
Muestra en la UI el estado actual de la conexión WebSocket: conectado (verde), reconectando (amarillo), error/desconectado (rojo).

---

## Servicios API

### `authService.js`
```javascript
login(email, password) → POST /login → { jwTtoken }
```

### `mesaService.js`
```javascript
abrirMesa(datos)              → POST /ordenes
mesasRango(inicio, fin)       → GET /mesas/rango/{inicio}/{fin}
obtenerOrdenActiva(idMesa)    → GET /ordenes/activa/{idMesa}
```

### `ordenService.js`
```javascript
abrirOrdenSinMesa(datos)      → POST /ordenes (tipo LLEVAR)
guardarDetalle(payload)       → POST /ordendetalles
cerrarOrden(idOrden)          → PUT /ordenes/{id}/cerrar
obtenerEntregasHoy()          → GET /ordenes/entregas/hoy
reenviarACocina(idOrden)      → POST /ordenes/{id}/reenviar-cocina
```

### `cocinaService.js`
```javascript
obtenerOrdenesPendientes()    → GET /cocina
marcarServido(idOrden)        → PATCH /cocina/{id}/servido
```

### `productoService.js`
```javascript
obtenerTodos()                → GET /productos
```

### `usuarioService.js`
```javascript
mostrarUsuarios()             → GET /usuarios
crearUsuario(datos)           → POST /usuarios
actualizarUsuario(datos)      → PUT /usuarios
eliminarUsuario(id)           → DELETE /usuarios/{id}
```

### `adminService.js`
```javascript
obtenerCorteDia(fecha)        → GET /admin?fecha=YYYY-MM-DD
obtenerCancelaciones(params)  → GET /admin/cancelaciones?desde=&hasta=
```

---

## Hooks personalizados

### `useMesaCart(idOrden, turno)`
Carrito de orden persistido en `localStorage`. Permite agregar platillos, modificar cantidades, cambiar comentarios y limpiar. Al llamar `guardarCarrito()` hace `POST /ordendetalles` con la comanda completa.

### `useMesasSala()`
Carga todas las mesas y se suscribe a `/topic/mesas` y `/topic/tickets`. Expone `mesas[]`, `stats` (total, ocupadas, libres) y actualiza en tiempo real.

### `useMesas(inicio, fin)`
Carga mesas de una sección específica. `actualizarMesa()` aplica actualizaciones optimistas del estado local antes de confirmar con el servidor.

### `usePersonal()`
Lista usuarios con `recargar()` para refetch manual post-mutación.

### `useReportes()`
Maneja fecha seleccionada, carga corte del día y cancelaciones juntos. `aplicarPeriodo('hoy'|'ayer')` cambia la fecha y recarga.

---

## Gestión de estado

No se usa Redux ni Zustand. El estado se gestiona con:

| Mecanismo | Dónde se usa |
|---|---|
| React `useState` / `useEffect` | Estado local en hooks y componentes |
| `localStorage` | Carrito de orden (persiste entre recargas) |
| `sessionStorage` | JWT token de sesión |
| WebSocket callbacks | Actualizaciones en tiempo real |

---

## Colores y temas

La app usa un esquema oscuro basado en Slate con acentos de colores semánticos:

| Color | Significado |
|---|---|
| Naranja / Amber | Acción principal, turno comida |
| Cyan / Blue | Turno desayuno |
| Emerald / Green | Estado listo, disponible |
| Red / Rose | Cancelaciones, errores |
| Slate | Fondos, contenedores |

---

## Notificaciones

`Sonner` provee toasts en cuatro variantes:
- `toast.success()` — operación completada
- `toast.error()` — error del servidor o validación
- `toast.info()` — información neutral
- `toast.loading()` → `toast.dismiss()` — operaciones asíncronas

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_BASE_URL` | URL base del backend | `http://localhost:8080` |

En producción cambiar por la URL pública del servidor.

---

## Build de producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para servir con Nginx, Apache o cualquier CDN.

```bash
npm run preview   # Preview local del build de producción
```

---

## Notas de producción

- Cambiar `VITE_API_BASE_URL` a la URL del servidor en producción
- El backend debe tener CORS configurado con el dominio real (no wildcard)
- La URL de WebSocket en `websocketService.js` usa la misma base URL de la API
- El token JWT en `sessionStorage` se pierde al cerrar la pestaña (comportamiento intencionado)
