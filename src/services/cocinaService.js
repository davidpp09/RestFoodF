import api from '../api/axiosConfig';

export const cocinaService = {
    obtenerOrdenesPendientes: async () => {
        const response = await api.get('/cocina');
        return response.data;
    },

    marcarServido: async (idOrden) => {
        const response = await api.patch(`/cocina/${idOrden}/servido`);
        return response.data;
    }
};
