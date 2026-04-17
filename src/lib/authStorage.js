// Persistencia de sesión: localStorage sobrevive al cierre del navegador.
// Formato guardado: { token, rol, nombre, id_usuarios, seccion, destino }

const KEY = 'sesion_restfood';

export const authStorage = {
    guardar(sesion) {
        localStorage.setItem(KEY, JSON.stringify(sesion));
    },
    leer() {
        try {
            const raw = localStorage.getItem(KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },
    actualizar(parcial) {
        const actual = authStorage.leer() ?? {};
        authStorage.guardar({ ...actual, ...parcial });
    },
    limpiar() {
        localStorage.removeItem(KEY);
    },
    token() {
        return authStorage.leer()?.token ?? null;
    },
    rol() {
        return authStorage.leer()?.rol ?? null;
    },
    idUsuario() {
        return authStorage.leer()?.id_usuarios ?? null;
    },
    seccion() {
        return authStorage.leer()?.seccion ?? null;
    },
    destino() {
        return authStorage.leer()?.destino ?? '/login';
    },
};
