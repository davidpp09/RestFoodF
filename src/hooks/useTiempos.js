import { useState, useEffect } from 'react';

const KEY = (idOrden) => `tiempos_${idOrden}`;

const INICIAL = {
    tiempo1: { consome: 0, sopa_crema: 0 },
    tiempo2: { arroz: 0, espaguetti: 0 },
};

const cargar = (idOrden) => {
    if (!idOrden) return INICIAL;
    try {
        const data = JSON.parse(localStorage.getItem(KEY(idOrden)));
        if (data && typeof data.tiempo1?.consome === 'number') return data;
        // Formato viejo o inválido — lo borra y usa el inicial limpio
        localStorage.removeItem(KEY(idOrden));
        return INICIAL;
    }
    catch { return INICIAL; }
};

export const ETIQUETAS_TIEMPOS = {
    consome: 'Consomé',
    sopa_crema: 'Sopa/Crema',
    arroz: 'Arroz',
    espaguetti: 'Espaguetti',
};

// Resumen legible ("2× Consomé · 1× Arroz") a partir del objeto de tiempos
export const resumenDeTiempos = (tiempos) => {
    if (!tiempos?.tiempo1) return '';
    return [...Object.entries(tiempos.tiempo1), ...Object.entries(tiempos.tiempo2)]
        .filter(([, v]) => Number(v) > 0)
        .map(([k, v]) => `${v}× ${ETIQUETAS_TIEMPOS[k]}`)
        .join(' · ');
};

// Igual pero leyendo lo guardado para una orden — para mostrar los tiempos
// en la tarjeta de la mesa sin montar el hook
export const resumenTiemposGuardados = (idOrden) => {
    if (!idOrden) return '';
    return resumenDeTiempos(cargar(idOrden));
};

export const useTiempos = (idOrden) => {
    const [tiempos, setTiempos] = useState(() => cargar(idOrden));

    useEffect(() => {
        setTiempos(cargar(idOrden));
    }, [idOrden]);

    useEffect(() => {
        if (!idOrden) return;
        localStorage.setItem(KEY(idOrden), JSON.stringify(tiempos));
    }, [tiempos, idOrden]);

    const cambiarCantidad = (tiempo, item, delta) => {
        setTiempos(prev => ({
            ...prev,
            [tiempo]: {
                ...prev[tiempo],
                [item]: Math.max(0, (Number(prev[tiempo][item]) || 0) + delta),
            },
        }));
    };

    const limpiar = (idOrden) => {
        localStorage.removeItem(KEY(idOrden));
        setTiempos(INICIAL);
    };

    return { tiempos, cambiarCantidad, limpiar };
};
