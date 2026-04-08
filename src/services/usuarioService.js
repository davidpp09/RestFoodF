import api from '../api/axiosConfig';

export const usuarioService = {

    mostrarUsuarios: async () => {
        const response = await api.get(`/usuarios`);
        return response.data.content;
    },

    crearUsuario: async (datosNuevoUsuario) => {
        const response = await api.post(`/usuarios`, datosNuevoUsuario);
        return response.data;
    },

    // ✅ AGREGAR ESTOS DOS MÉTODOS
    actualizarUsuario: async (datos) => {
        const response = await api.put(`/usuarios`, datos);
        return response.data;
    },

    eliminarUsuario: async (id) => {
        const response = await api.delete(`/usuarios/${id}`);
        return response.data;
    }
};