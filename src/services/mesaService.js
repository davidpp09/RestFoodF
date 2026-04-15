import api from '../api/axiosConfig';

export const mesaService = {
    abrirMesa: async (datosOrden) => {
        const response = await api.post(`/ordenes`, datosOrden);
        return response.data;
    },

    mesasRango: async (inicio, fin) => {
        const response = await api.get(`/mesas/rango/${inicio}/${fin}`);
        return response.data;
    },

    obtenerOrdenActiva: async (idMesa) => {
        const response = await api.get(`/ordenes/activa/${idMesa}`);
        return response.data; // { id_orden, numero_comanda, total, platillos: [...] }
    },
};


