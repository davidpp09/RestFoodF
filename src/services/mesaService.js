import api from '../api/axiosConfig';

export const mesaService = {
    abrirMesa: async (datosOrden) => {
        // Esta función hace el POST y devuelve la respuesta del servidor
        const response = await api.post(`/ordenes`, datosOrden);
        return response.data; // Aquí vendría el nuevo estado (ej. OCUPADA)
    },

    mesasRango: async (inicio, fin) => {
        const response = await api.get(`/mesas/rango/${inicio}/${fin}`);
        return response.data;
    },
}


