import { useState, useEffect, useCallback } from 'react';
import { inventarioService } from '../services/inventarioService';
import { toast } from 'sonner';

/** Catálogo de insumos: lo que se controla. Usado por la pantalla de admin. */
export const useInsumos = () => {
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargar = useCallback(async () => {
        setLoading(true);
        try {
            setInsumos(await inventarioService.obtenerInsumos());
        } catch (error) {
            toast.error(error.response?.data?.mensaje || 'Error al cargar los insumos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    return { insumos, loading, recargar: cargar };
};

/**
 * Existencias: el stock sale de sumar el kardex, no de una columna, así que
 * hay que volver a pedirlo después de cada movimiento. Por eso `recargar` se
 * expone y las pantallas lo llaman al guardar.
 */
export const useExistencias = () => {
    const [existencias, setExistencias] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargar = useCallback(async () => {
        setLoading(true);
        try {
            setExistencias(await inventarioService.obtenerExistencias());
        } catch (error) {
            toast.error(error.response?.data?.mensaje || 'Error al cargar las existencias');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    const bajoMinimo = existencias.filter(e => e.bajo_minimo);

    return { existencias, bajoMinimo, loading, recargar: cargar };
};

/**
 * El kardex de cada insumo, por páginas.
 *
 * El historial crece unos 30 movimientos al día por insumo, así que ya no se
 * pide completo: se trae la primera página al abrir el renglón y las demás con
 * "Ver más", que se van sumando debajo.
 *
 * Guarda el estado por insumo (`kardex[id]`) para que al cerrar y volver a abrir
 * un renglón no se pida otra vez. `reiniciar` lo borra todo: se llama cuando se
 * actualizan las existencias, porque un historial viejo con un stock nuevo
 * dejaría de cuadrar.
 *
 * Estado de cada insumo:
 *   { movimientos, pagina, total, ultima, cargando, error }
 */
export const useKardex = (tamano = 20) => {
    const [kardex, setKardex] = useState({});

    const cargarPagina = useCallback(async (idInsumo, pagina) => {
        setKardex(prev => ({
            ...prev,
            [idInsumo]: { movimientos: [], ...prev[idInsumo], cargando: true, error: null },
        }));
        try {
            const datos = await inventarioService.obtenerMovimientos(idInsumo, { pagina, tamano });
            setKardex(prev => {
                const anteriores = pagina === 0 ? [] : (prev[idInsumo]?.movimientos ?? []);
                return {
                    ...prev,
                    [idInsumo]: {
                        movimientos: [...anteriores, ...datos.contenido],
                        pagina: datos.pagina,
                        total: datos.totalElementos,
                        ultima: datos.ultima,
                        cargando: false,
                        error: null,
                    },
                };
            });
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || 'No se pudo cargar el historial';
            setKardex(prev => ({
                ...prev,
                [idInsumo]: { movimientos: [], ...prev[idInsumo], cargando: false, error: mensaje },
            }));
        }
    }, [tamano]);

    /** Primera página, solo si todavía no se tiene (o si la vez anterior falló). */
    const abrir = useCallback((idInsumo) => {
        const actual = kardex[idInsumo];
        if (!actual || (actual.error && actual.movimientos.length === 0)) {
            cargarPagina(idInsumo, 0);
        }
    }, [kardex, cargarPagina]);

    /** La página siguiente; si la anterior falló, reintenta esa misma. */
    const cargarMas = useCallback((idInsumo) => {
        const actual = kardex[idInsumo];
        if (!actual || actual.cargando || actual.ultima) return;
        cargarPagina(idInsumo, actual.pagina === undefined ? 0 : actual.pagina + 1);
    }, [kardex, cargarPagina]);

    const reiniciar = useCallback(() => setKardex({}), []);

    return { kardex, abrir, cargarMas, reiniciar };
};
