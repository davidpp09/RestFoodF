import { useState, useEffect } from "react";
import { mesaService } from "../services/mesaService";

export const useMesas = (inicio, fin) => {
    const [mesas, setMesas] = useState([]);
    const [cargando, setCargando] = useState(true);


    useEffect(() => {
        const cargarMesas = async () => {
            setMesas(await mesaService.mesasRango(inicio, fin));
            setCargando(false)
        };

        cargarMesas();
    }, [inicio, fin]); // Tip: React pide que pongamos aquí las variables que usamos adentro

    return { mesas, cargando };
};