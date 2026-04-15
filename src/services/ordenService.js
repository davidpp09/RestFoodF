import api from '../api/axiosConfig';

export const ordenService = {
    abrirOrdenSinMesa: async ({ id_usuario, servicio }) => {
        const response = await api.post('/ordenes', { id_usuario, tipo: 'LLEVAR', servicio });
        return response.data; // { id_orden, numero_comanda }
    },

    guardarDetalle: async (payload) => {
        const response = await api.post('/ordendetalles', payload);
        return response.data;
    },

    cerrarOrden: async (idOrden) => {
        const response = await api.put(`/ordenes/${idOrden}/cerrar`);
        return response.data;
    },

    obtenerEntregasHoy: async () => {
        const response = await api.get('/ordenes/entregas/hoy');
        return response.data;
    },
};
