import api from '../api/axiosConfig';

export const adminService = {
    obtenerCorteDia: async () => {
        const response = await api.get('/admin');
        return response.data;
    }
};