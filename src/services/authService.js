import api from '../api/axiosConfig';

export const authService = {
    login: async (email, password) => {
        // Esta función hace la petición y devuelve la respuesta
        const response = await api.post(`/login`, {
            email: email,
            contrasena: password
        });
        return response.data.jwTtoken; // Devolvemos solo los datos (el token, etc.)
    },

    // Aquí podrías agregar después: logout, register, etc.
};