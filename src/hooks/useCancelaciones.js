import { useState, useEffect } from 'react';
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

    useEffect(() => {
        // Si el usuario cambia el filtro con una petición en vuelo, se
        // descarta la respuesta vieja para no pisar la nueva
        let cancelado = false;

        const cargar = async () => {
            try {
                const data = await adminService.obtenerCancelaciones({ desde, hasta });
                if (!cancelado) setCancelaciones(data);
            } catch (error) {
                console.error('Error al cargar cancelaciones:', error);
            }
        };

        cargar();
        return () => { cancelado = true; };
    }, [desde, hasta]);

    const aplicarPeriodo = (periodo) => {
        const h = hoy();
        if (periodo === 'hoy')   { setDesde(h);         setHasta(h);         }
        if (periodo === 'ayer')  { setDesde(hace(1));    setHasta(hace(1));   }
        if (periodo === 'semana'){ setDesde(hace(6));    setHasta(h);         }
    };

    return { cancelaciones, desde, hasta, setDesde, setHasta, aplicarPeriodo };
};
