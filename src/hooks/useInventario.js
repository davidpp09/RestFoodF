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
