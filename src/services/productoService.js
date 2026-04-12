import api from '../api/axiosConfig';

export const productoService = {
    obtenerTodos: async () => {
        const response = await api.get('/productos');
        return response.data;
    },
};
