import api from '../api/axiosConfig';

// Todas las operaciones sobre platillos (/productos) viven aquí.
// Las pantallas nunca llaman a la API directo: siempre pasan por este service.
export const productoService = {
    obtenerTodos: async () => {
        const response = await api.get('/productos');
        return response.data;
    },
    crear: async (datos) => {
        const response = await api.post('/productos', datos);
        return response.data;
    },
    actualizar: async (id, datos) => {
        const response = await api.put(`/productos/${id}`, datos);
        return response.data;
    },
    eliminar: async (id) => {
        await api.delete(`/productos/${id}`);
    },
    // Platillos del día: cambia disponibilidad o precio de un platillo del día
    actualizarDia: async (id, datos) => {
        const response = await api.patch(`/productos/${id}/dia`, datos);
        return response.data;
    },
    // Cierra el día: desactiva todos los platillos de la categoría indicada
    desactivarDia: async (idCategoria) => {
        await api.put(`/productos/desactivar-dia/${idCategoria}`);
    },
};
