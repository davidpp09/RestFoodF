import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';

const hoy = () => new Date().toISOString().split('T')[0];

const hace = (dias) => {
    const d = new Date();
    d.setDate(d.getDate() - dias);
    return d.toISOString().split('T')[0];
};

export const useCancelaciones = () => {
    const [cancelaciones, setCancelaciones] = useState([]);
    const [desde, setDesde] = useState(hoy());
    const [hasta, setHasta] = useState(hoy());

    const cargar = useCallback(async (d, h) => {
        try {
            const data = await adminService.obtenerCancelaciones({ desde: d, hasta: h });
            setCancelaciones(data);
        } catch (error) {
            console.error('Error al cargar cancelaciones:', error);
        }
    }, []);

    useEffect(() => {
        cargar(desde, hasta);
    }, [desde, hasta, cargar]);

    const aplicarPeriodo = (periodo) => {
        const h = hoy();
        if (periodo === 'hoy')   { setDesde(h);         setHasta(h);         }
        if (periodo === 'ayer')  { setDesde(hace(1));    setHasta(hace(1));   }
        if (periodo === 'semana'){ setDesde(hace(6));    setHasta(h);         }
    };

    return { cancelaciones, desde, hasta, setDesde, setHasta, aplicarPeriodo };
};
