import { useState, useEffect } from "react";
import { mesaService } from "../services/mesaService";
import { toast } from "sonner";
import websocketService from "../services/websocketService";

export const useMesas = (inicio, fin) => {
    const [mesas, setMesas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarMesas = async () => {
            try {
                const data = await mesaService.mesasRango(inicio, fin);
                setMesas(data);
            } catch (error) {
                toast.error('Error al cargar las mesas');
            } finally {
                setCargando(false);
            }
        };

        cargarMesas();

        // Suscribirse a cambios en tiempo real de mesas
        const token = localStorage.getItem('token_restfood');
        if (token) {
            websocketService.conectar(token);
            websocketService.subscribe('/topic/mesas', (aviso) => {
                // El backend envía un aviso con id_mesa y estado
                // { id_mesa: 5, estado: "OCUPADA", id_orden: 10, ... }
                if (aviso && (aviso.id_mesa || aviso.idMesa)) {
                    const idMesaRecibida = aviso.id_mesa || aviso.idMesa;
                    actualizarMesa(idMesaRecibida, {
                        estado: aviso.estado,
                        id_orden: aviso.id_orden || aviso.idOrden || null
                    });
                }
            });
        }

        return () => {
            // websocketService.desconectar(); // Comentado porque App.jsx también lo maneja
        };
    }, [inicio, fin]);

    // Maneja tanto { id } como { id_mesa } según lo que mande el back
    const actualizarMesa = (mesaId, cambios) => {
        setMesas(prev => prev.map(m =>
            (m.id === mesaId || m.id_mesa === mesaId)
                ? { ...m, ...cambios }
                : m
        ));
    };

    return { mesas, cargando, actualizarMesa };
};
