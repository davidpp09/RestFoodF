import api from '../api/axiosConfig';

export const categoriaService = {
    obtenerTodas: async () => {
        const response = await api.get('/categorias');
        return response.data;
    },
};
