import api from '../api/axiosConfig';

export const usuarioService = {

    mostrarUsuarios: async () => {
        const response = await api.get(`/usuarios`);
        return response.data.content;
    },
};