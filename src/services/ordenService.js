import api from '../api/axiosConfig';

export const ordenService = {
    guardarDetalle: async (payload) => {
        const response = await api.post('/ordendetalles', payload);
        return response.data;
    },

    cerrarOrden: async (idOrden) => {
        const response = await api.put(`/ordenes/${idOrden}/cerrar`);
        return response.data; // Retorna el ticket { id_orden, total, platillos, ... }
    },
};
