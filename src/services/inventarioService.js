import api from '../api/axiosConfig';

// Todas las operaciones de inventario (/inventario) viven aquí.
// Las pantallas nunca llaman a la API directo: siempre pasan por este service.
export const inventarioService = {
    // --- Catálogo de insumos (ADMIN/DEV) ---
    obtenerInsumos: async () => {
        const response = await api.get('/inventario/insumos');
        return response.data;
    },
    crearInsumo: async (datos) => {
        const response = await api.post('/inventario/insumos', datos);
        return response.data;
    },
    actualizarInsumo: async (id, datos) => {
        const response = await api.put(`/inventario/insumos/${id}`, datos);
        return response.data;
    },
    desactivarInsumo: async (id) => {
        await api.delete(`/inventario/insumos/${id}`);
    },

    // --- Existencias y movimientos ---
    obtenerExistencias: async () => {
        const response = await api.get('/inventario/existencias');
        return response.data;
    },
    // La cantidad va SIEMPRE en positivo: el signo lo pone el backend según el
    // tipo. Quien captura dice "se echaron a perder 3", nunca "menos 3".
    registrarMovimiento: async ({ id_insumo, tipo, cantidad, motivo }) => {
        const response = await api.post('/inventario/movimientos', {
            id_insumo, tipo, cantidad, motivo: motivo || null,
        });
        return response.data;
    },
    obtenerKardex: async (idInsumo) => {
        const response = await api.get(`/inventario/insumos/${idInsumo}/kardex`);
        return response.data;
    },

    // --- Recetas: qué platillo consume qué insumo ---
    // Panorama completo: todas las relaciones. Permite ver qué platillos ya
    // cuelgan de otro insumo y cuáles no cuelgan de ninguno.
    obtenerTodasLasRecetas: async () => {
        const response = await api.get('/inventario/recetas');
        return response.data;
    },
    obtenerReceta: async (idInsumo) => {
        const response = await api.get(`/inventario/insumos/${idInsumo}/receta`);
        return response.data;
    },
    // Reemplaza la receta completa del insumo: los platillos que no vayan en
    // `lineas` quedan desligados. Mandar [] desliga todos.
    guardarReceta: async (idInsumo, lineas) => {
        const response = await api.put(`/inventario/insumos/${idInsumo}/receta`, { lineas });
        return response.data;
    },

    // --- Conteo físico ---
    // Manda todas las líneas juntas: el backend calcula la varianza contra el
    // kardex y genera un AJUSTE por cada insumo que no cuadró.
    registrarConteo: async ({ notas, lineas }) => {
        const response = await api.post('/inventario/conteos', { notas, lineas });
        return response.data;
    },

    // --- Teórico contra real (Fase 2) ---
    // Sin fechas, el backend toma el mes en curso. Las fechas van como
    // YYYY-MM-DD, que es lo que producen los <input type="date">.
    obtenerTeoricoReal: async (desde, hasta) => {
        const params = {};
        if (desde) params.desde = desde;
        if (hasta) params.hasta = hasta;
        const response = await api.get('/inventario/reportes/teorico-real', { params });
        return response.data;
    },
};
