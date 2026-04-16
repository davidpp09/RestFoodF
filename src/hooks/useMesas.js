import { useState, useEffect } from "react";
import { mesaService } from "../services/mesaService";
import { toast } from "sonner";

export const useMesas = (inicio, fin) => {
    const [mesas, setMesas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const cargarMesas = async () => {
            try {
                const data = await mesaService.mesasRango(inicio, fin);
                setMesas(data);
            } catch {
                toast.error('Error al cargar las mesas');
                setError(true);
            } finally {
                setCargando(false);
            }
        };

        cargarMesas();
    }, [inicio, fin]);

    // Maneja tanto { id } como { id_mesa } según lo que mande el back
    const actualizarMesa = (mesaId, cambios) => {
        setMesas(prev => prev.map(m =>
            (m.id === mesaId || m.id_mesa === mesaId)
                ? { ...m, ...cambios }
                : m
        ));
    };

    return { mesas, cargando, error, actualizarMesa };
};
