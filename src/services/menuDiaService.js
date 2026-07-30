import api from '../api/axiosConfig';

// El menú del día en PDF. El backend lo arma con los platillos que están
// activos, así que no hay nada que mandarle: solo se pide.
export const menuDiaService = {
    // responseType blob porque llega un PDF binario, no JSON. Sin esto axios
    // lo interpreta como texto y el archivo sale corrupto.
    obtenerPdf: async () => {
        const response = await api.get('/menu-dia/pdf', { responseType: 'blob' });
        return response.data;
    },
};
