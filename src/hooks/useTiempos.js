import { useState, useEffect } from 'react';

const KEY = (idOrden) => `tiempos_${idOrden}`;

const INICIAL = {
    tiempo1: { consome: 0, sopa_crema: 0 },   // COMIDA
    tiempo2: { arroz: 0, espaguetti: 0 },     // COMIDA
    desayuno: { cafe: 0, jugo: 0 },           // DESAYUNO
};

const cargar = (idOrden) => {
    if (!idOrden) return INICIAL;
    try {
        const data = JSON.parse(localStorage.getItem(KEY(idOrden)));
        if (data && typeof data.tiempo1?.consome === 'number') {
            // Fusionar con INICIAL para tolerar formatos previos sin 'desayuno'
            return {
                tiempo1:  { ...INICIAL.tiempo1,  ...data.tiempo1 },
                tiempo2:  { ...INICIAL.tiempo2,  ...data.tiempo2 },
                desayuno: { ...INICIAL.desayuno, ...data.desayuno },
            };
        }
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
    cafe: 'Café',
    jugo: 'Jugo',
};

// Lista legible de lo marcado (["Consomé: 3", "Café: 2"]) leyendo lo guardado
// para una orden — para la tarjeta de la mesa sin montar el hook
export const listaTiemposGuardados = (idOrden) => {
    if (!idOrden) return [];
    const t = cargar(idOrden);
    if (!t?.tiempo1) return [];
    return [...Object.entries(t.tiempo1), ...Object.entries(t.tiempo2), ...Object.entries(t.desayuno ?? {})]
        .filter(([, v]) => Number(v) > 0)
        .map(([k, v]) => `${ETIQUETAS_TIEMPOS[k]}: ${v}`);
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
