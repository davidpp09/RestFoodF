import api from '../api/axiosConfig';

export const usuarioService = {

    // Activos y dados de baja, sin paginar (pantalla de Personal)
    todos: async () => {
        const response = await api.get(`/usuarios/todos`);
        return response.data;
    },

    crearUsuario: async (datosNuevoUsuario) => {
        const response = await api.post(`/usuarios`, datosNuevoUsuario);
        return response.data;
    },

    actualizarUsuario: async (datos) => {
        const response = await api.put(`/usuarios`, datos);
        return response.data;
    },

    // Baja lógica: el empleado deja de poder entrar, su historial se conserva
    eliminarUsuario: async (id) => {
        const response = await api.delete(`/usuarios/${id}`);
        return response.data;
    },

    activarUsuario: async (id) => {
        const response = await api.put(`/usuarios/activar/${id}`);
        return response.data;
    },

    cambiarContrasena: async (id, contrasena) => {
        const response = await api.put(`/usuarios/${id}/contrasena`, { contrasena });
        return response.data;
    },

    // { hoy, semana, mes: { ordenes, total }, platillos_cancelados_mes }
    ventas: async (id) => {
        const response = await api.get(`/usuarios/${id}/ventas`);
        return response.data;
    },
};
