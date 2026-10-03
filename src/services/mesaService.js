import api from '../api/axiosConfig';

export const mesaService = {
    abrirMesa: async (datosOrden) => {
        const response = await api.post(`/ordenes`, datosOrden);
        return response.data;
    },

    // Las mesas de la mesera que inició sesión (ADMIN/DEV: todas las activas)
    misMesas: async () => {
        const response = await api.get(`/mesas/mias`);
        return response.data;
    },

    obtenerOrdenActiva: async (idMesa) => {
        const response = await api.get(`/ordenes/activa/${idMesa}`);
        return response.data; // { id_orden, numero_comanda, total, platillos: [...] }
    },

    // --- Gestión (pantalla de Personal, solo ADMIN/DEV) ---

    // Todas, incluidas las dadas de baja: [{ id_mesa, numero, estado, activa, id_usuario_asignado, nombre_asignado }]
    gestion: async () => {
        const response = await api.get(`/mesas/gestion`);
        return response.data;
    },

    crear: async (numero, idUsuarioAsignado) => {
        const response = await api.post(`/mesas`, { numero, id_usuario_asignado: idUsuarioAsignado ?? null });
        return response.data;
    },

    // Rango completo, p. ej. 51-65. Todo o nada: si alguna existe no crea ninguna.
    crearLote: async (desde, hasta, idUsuarioAsignado) => {
        const response = await api.post(`/mesas/lote`, { desde, hasta, id_usuario_asignado: idUsuarioAsignado ?? null });
        return response.data;
    },

    renombrar: async (idMesa, numero) => {
        const response = await api.put(`/mesas/${idMesa}`, { numero });
        return response.data;
    },

    darDeBaja: async (idMesa) => {
        const response = await api.delete(`/mesas/${idMesa}`);
        return response.data;
    },

    reactivar: async (idMesa) => {
        const response = await api.put(`/mesas/${idMesa}/activar`);
        return response.data;
    },

    // idUsuario null = dejar las mesas sin asignar
    asignar: async (idUsuario, idsMesas) => {
        const response = await api.put(`/mesas/asignacion`, { id_usuario: idUsuario, mesas: idsMesas });
        return response.data;
    },

    cubrirTurno: async (de, a) => {
        const response = await api.post(`/mesas/cubrir-turno`, { de, a });
        return response.data; // { mesas_movidas }
    },
};
