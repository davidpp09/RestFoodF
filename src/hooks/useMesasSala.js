// src/hooks/useMesasSala.js
import { useState, useEffect, useMemo } from 'react';
import websocketService from '../services/websocketService';
import api from '../api/axiosConfig';
import { toast } from 'sonner';

export const useMesasSala = () => {
    // Eliminamos localStorage por requerimiento de seguridad y para evitar datos stale (viejos)
    const [mesas, setMesas] = useState([]);

    // Carga inicial desde API
    useEffect(() => {
        const cargarData = async () => {
            try {
                const response = await api.get('/mesas');
                if (response.data) {
                    setMesas(response.data);
                }
            } catch (error) {
                console.error("Error cargando mesas admin:", error);
            }
        };
        cargarData();
    }, []);

    // Suscripciones WebSocket
    useEffect(() => {
        const token = sessionStorage.getItem('token_restfood');
        let unsubMesas, unsubTickets;
        if (token) {
            websocketService.conectar(token);

            // Actualizaciones de mesas en tiempo real
            unsubMesas = websocketService.subscribe('/topic/mesas', (aviso) => {
                console.log("📺 [WS Admin] Recibido aviso:", aviso);

                setMesas((prevMesas) => prevMesas.map((mesa) => {
                    const idRecibido = aviso.id_mesa || aviso.idMesa;

                    if (idRecibido && mesa.id_mesa == idRecibido) {
                        if (aviso.estado === 'LIBRE') {
                            return {
                                ...mesa,
                                estado: 'LIBRE',
                                nombre_mesero: '',
                                id_orden: null,
                                platillos: []
                            };
                        }

                        return {
                            ...mesa,
                            ...aviso,
                            platillos: aviso.platillos || mesa.platillos || []
                        };
                    }
                    return mesa;
                }));
            });

            // Notificación no invasiva cuando se cierra una cuenta
            unsubTickets = websocketService.subscribe('/topic/tickets', (ticket) => {
                const mesaStr = ticket.numeroMesa ? `Mesa ${ticket.numeroMesa}` : 'Para llevar';
                toast.success(`Cuenta cerrada — ${mesaStr}`, {
                    description: `Comanda #${ticket.numero_comanda ?? ticket.id_orden} · Total: $${ticket.total?.toFixed(2)}`,
                    duration: 5000,
                });
            });
        }

        return () => {
            unsubMesas?.();
            unsubTickets?.();
            websocketService.desconectar();
        };
    }, []);

    const stats = useMemo(() => ({
        total: mesas.length,
        ocupadas: mesas.filter(m => m.estado === 'OCUPADA').length,
        libres: mesas.filter(m => m.estado === 'LIBRE').length
    }), [mesas]);

    return { mesas, stats };
};
