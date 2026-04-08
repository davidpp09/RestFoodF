import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { toast } from 'sonner';

export const useReportes = () => {
    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(true);

    const cargarReportes = async () => {
        setLoading(true);
        try {
            const resultado = await adminService.obtenerCorteDia();
            setDatos(resultado);
        } catch (error) {
            console.error('Error al cargar reportes:', error);
            toast.error('Error al cargar los reportes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarReportes();
    }, []);

    return {
        datos,
        loading,
        recargar: cargarReportes
    };
};