import axios from 'axios';
import { toast } from 'sonner';
import { authStorage } from '../lib/authStorage';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = authStorage.token();
        if (token && config.url !== '/login') {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url;
        // 401 = sesión inválida o expirada → cerrar sesión y volver al login.
        if (status === 401 && url !== '/login') {
            authStorage.limpiar();
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
            }
        }
        // 403 = sesión válida pero sin permiso para ESTA acción → avisar sin tirar la sesión.
        if (status === 403 && url !== '/login') {
            const mensaje = error.response?.data?.mensaje ?? 'No tienes permiso para realizar esta acción.';
            toast.error(mensaje, { id: 'error-403' });
        }
        return Promise.reject(error);
    }
);

export default api;
