// src/hooks/useMesasSala.js
import { useState, useEffect, useMemo } from 'react';
import websocketService from '../services/websocketService';
import { mesaService } from '../services/mesaService';
import { authStorage } from '../lib/authStorage';
import { toast } from 'sonner';

export const useMesasSala = () => {
    // Eliminamos localStorage por requerimiento de seguridad y para evitar datos stale (viejos)
    const [mesas, setMesas] = useState([]);

    // Carga inicial desde API
    useEffect(() => {
        const cargarData = async () => {
            // Pasa por mesaService como el resto de la app (pages → hooks → services):
            // antes era el único hook que llamaba a la API directo.
            try {
                const datos = await mesaService.sala();
                if (datos) {
                    setMesas(datos);
                }
            } catch (error) {
                // Antes solo iba a la consola y la sala se quedaba vacía sin explicación.
                toast.error(error.response?.data?.mensaje || 'No se pudieron cargar las mesas');
            }
        };
        cargarData();
    }, []);

    // Suscripciones WebSocket
    useEffect(() => {
        const token = authStorage.token();
        let unsubMesas, unsubTickets;
        if (token) {
            websocketService.conectar(token);

            // Actualizaciones de mesas en tiempo real
            unsubMesas = websocketService.subscribe('/topic/mesas', (aviso) => {

                setMesas((prevMesas) => prevMesas.map((mesa) => {
                    const idRecibido = aviso.id_mesa || aviso.idMesa;

                    if (idRecibido && mesa.id_mesa == idRecibido) {
                        if (aviso.estado === 'LIBRE') {
                            return {
                                ...mesa,
                                estado: 'LIBRE',
                                nombre_mesero: '',
                                id_orden: null,
                                platillos: [],
                                fechaApertura: null
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
                    description: `Comanda #${ticket.numero_comanda ?? ticket.id_orden} · Total: $${ticket.total?.toFixed(0)}`,
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
