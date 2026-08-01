import api from '../api/axiosConfig';

// El menú del día. El backend lo arma con los platillos que están activos, así
// que no hay nada que mandarle: solo se pide.
export const menuDiaService = {
    // La vista previa se pide como IMAGEN, no como PDF.
    //
    // El WebView de Android —lo que corre dentro de Fully Kiosk en las tablets—
    // no trae visor de PDF: un <iframe> apuntando a un PDF se queda en blanco y
    // no da ningún error. Un <img> se dibuja en cualquier navegador. El PDF
    // sigue siendo lo que se descarga y se manda a imprimir.
    //
    // responseType blob porque llega binario, no JSON.
    obtenerImagen: async () => {
        const response = await api.get('/menu-dia/imagen', { responseType: 'blob' });
        return response.data;
    },

    // Pide una URL de descarga que se autentica sola durante 3 minutos.
    //
    // No se descarga con axios a propósito. Bajar el PDF y volverlo un blob:
    // funciona en una computadora, pero en el WebView de Android **una descarga
    // desde blob: no se dispara nunca**, y el clic acaba contando como ventana
    // nueva, que en modo kiosko está prohibida. Por eso el repartidor veía
    // "popups disabled" en lugar de un archivo. Con una URL normal, el gestor
    // de descargas de Android la toma como cualquier otra descarga.
    obtenerEnlaceDeDescarga: async () => {
        const response = await api.post('/menu-dia/enlace-descarga');
        return response.data.url;
    },
};
