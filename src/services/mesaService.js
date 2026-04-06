import api from '../api/axiosConfig';

export const mesaService = {
    abrirMesa: async (datosOrden) => {
        // Esta función hace el POST y devuelve la respuesta del servidor
        const response = await api.post(`/orden`, datosOrden);
        return response.data; // Aquí vendría el nuevo estado (ej. OCUPADA)
    },
};