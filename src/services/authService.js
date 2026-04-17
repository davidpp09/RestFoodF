import api from '../api/axiosConfig';

export const authService = {
    // Devuelve el objeto completo de sesión del backend:
    // { jwTtoken, rol, nombre, id_usuarios, seccion, destino }
    login: async (email, password) => {
        const response = await api.post(`/login`, { email, contrasena: password });
        return response.data;
    },
    // Revalida la sesión contra el backend. Útil al arrancar la app.
    me: async () => {
        const response = await api.get('/usuarios/me');
        return response.data;
    },
};
