import api from '../api/axiosConfig';

export const adminService = {
    obtenerCorteDia: async (fecha) => {
        const params = fecha ? { fecha } : {};
        const response = await api.get('/admin/corte-dia', { params });
        return response.data;
    },

    obtenerComandas: async (fecha) => {
        const params = fecha ? { fecha } : {};
        const response = await api.get('/admin/comandas-dia', { params });
        return response.data;
    },

    obtenerCancelaciones: async ({ desde, hasta } = {}) => {
        const params = {};
        if (desde) params.desde = desde;
        if (hasta) params.hasta = hasta;
        const response = await api.get('/admin/cancelaciones', { params });
        return response.data;
    },
};