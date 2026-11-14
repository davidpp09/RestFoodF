import api from '../api/axiosConfig';

export const grupoPrecioService = {
    obtenerGrupos: async (signal) => (await api.get('/grupos-precio', { signal })).data,
    obtenerMapa: async (signal) => (await api.get('/menu-dia/mapa-precios', { signal })).data,
    obtenerImagen: async (pagina, signal) => (await api.get('/menu-dia/editor/imagen', {
        params: { pagina }, responseType: 'blob', signal,
    })).data,
    actualizar: async (clave, precio) => (await api.patch(`/grupos-precio/${encodeURIComponent(clave)}`, { precio })).data,
    historial: async (id, signal) => (await api.get(`/productos/${id}/historial-precios`, { signal })).data,
};
