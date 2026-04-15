import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';
import { toast } from 'sonner';

const hoy = () => new Date().toISOString().split('T')[0];

const hace = (dias) => {
    const d = new Date();
    d.setDate(d.getDate() - dias);
    return d.toISOString().split('T')[0];
};

export const useReportes = () => {
    const [datos, setDatos] = useState(null);
    const [cancelaciones, setCancelaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fecha, setFecha] = useState(hoy());

    const cargarReportes = useCallback(async (f) => {
        setLoading(true);
        try {
            const [corte, cancels] = await Promise.all([
                adminService.obtenerCorteDia(f),
                adminService.obtenerCancelaciones({ desde: f, hasta: f }),
            ]);
            setDatos(corte);
            setCancelaciones(cancels);
        } catch (error) {
            console.error('Error al cargar reportes:', error);
            toast.error('Error al cargar los reportes');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarReportes(fecha);
    }, [fecha, cargarReportes]);

    const aplicarPeriodo = (periodo) => {
        if (periodo === 'hoy')  setFecha(hoy());
        if (periodo === 'ayer') setFecha(hace(1));
    };

    return {
        datos,
        cancelaciones,
        loading,
        fecha,
        setFecha,
        aplicarPeriodo,
        recargar: () => cargarReportes(fecha),
    };
};
