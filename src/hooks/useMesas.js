import { useState, useEffect } from "react";
import { mesaService } from "../services/mesaService";
import { toast } from "sonner";

export const useMesas = (inicio, fin) => {
    const [mesas, setMesas] = useState([]);
    const [cargando, setCargando] = useState(true);


    useEffect(() => {
        const cargarMesas = async () => {
            try {
                setMesas(await mesaService.mesasRango(inicio, fin));
            } catch (error) {
                toast.error('Error al cargar las mesas');
            } finally {
                setCargando(false);
            }
        };

        cargarMesas();
    }, [inicio, fin]); // Tip: React pide que pongamos aquí las variables que usamos adentro

    return { mesas, cargando };
};