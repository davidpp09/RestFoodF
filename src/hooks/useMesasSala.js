// src/hooks/useMesasSala.js
import { useState, useEffect, useMemo } from 'react';
import websocketService from '../services/websocketService';
import { toast } from 'sonner';

export const useMesasSala = () => {
    const STORAGE_KEY = 'admin_mesas_state';

    const [mesas, setMesas] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { console.error(e); }
        }
        return Array.from({ length: 40 }, (_, i) => ({
            id_mesa: i + 1, estado: "LIBRE", nombre_mesero: "", id_orden: null, platillos: []
        }));
    });

    // Guardado automático en localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mesas));
    }, [mesas]);

    // Conexión WebSocket
    useEffect(() => {
        const token = localStorage.getItem('token_restfood');
        if (!token) return;

        websocketService.conectar(token);

        // Actualizaciones de mesas en tiempo real
        websocketService.subscribe('/topic/mesas', (mesaActualizada) => {
            setMesas((prevMesas) => prevMesas.map((mesa) => {
                if (mesaActualizada.id_mesa && mesa.id_mesa == mesaActualizada.id_mesa) {
                    if (mesaActualizada.estado === 'OCUPADA' && mesa.estado === 'LIBRE') {
                        return { ...mesa, ...mesaActualizada, platillos: [] };
                    }
                    if (mesaActualizada.estado === 'LIBRE') {
                        return { ...mesa, estado: 'LIBRE', nombre_mesero: '', id_orden: null, platillos: [] };
                    }
                    return { ...mesa, ...mesaActualizada, platillos: mesaActualizada.platillos || mesa.platillos || [] };
                }
                // Actualización de platillos por orden (sin id_mesa)
                if (!mesaActualizada.id_mesa && mesaActualizada.id_orden && mesa.id_orden == mesaActualizada.id_orden) {
                    return { ...mesa, platillos: [...(mesa.platillos || []), ...(mesaActualizada.platillos || [])] };
                }
                return mesa;
            }));
        });

        // Notificación no invasiva cuando se cierra una cuenta
        websocketService.subscribe('/topic/tickets', (ticket) => {
            const mesa = ticket.numeroMesa ? `Mesa ${ticket.numeroMesa}` : 'Para llevar';
            toast.success(`Cuenta cerrada — ${mesa}`, {
                description: `Orden #${ticket.id_orden} · ${ticket.nombre_mesero || 'Mesero'} · Total: $${ticket.total?.toFixed(2)}`,
                duration: 5000,
            });
        });

        return () => websocketService.desconectar();
    }, []);

    const stats = useMemo(() => ({
        total: mesas.length,
        ocupadas: mesas.filter(m => m.estado === 'OCUPADA').length,
        libres: mesas.filter(m => m.estado === 'LIBRE').length
    }), [mesas]);

    return { mesas, stats };
};
