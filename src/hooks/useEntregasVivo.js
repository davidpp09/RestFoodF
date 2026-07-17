// src/hooks/useEntregasVivo.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import websocketService from '../services/websocketService';
import { ordenService } from '../services/ordenService';
import { authStorage } from '../lib/authStorage';

// Pedidos para llevar del día, actualizados en tiempo real.
// Recarga la lista cuando cocina recibe/cierra órdenes o se cierra una cuenta.
export const useEntregasVivo = () => {
    const [entregas, setEntregas] = useState([]);
    const [cargando, setCargando] = useState(true);

    const cargar = useCallback(async () => {
        try {
            const data = await ordenService.obtenerEntregasHoy();
            // Sin platillos = orden aún en captura (o abandonada), no una entrega real
            setEntregas(data.filter(e => e.platillos?.length > 0));
        } catch (error) {
            console.error('Error cargando entregas del día:', error);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargar();

        // El aviso WS puede llegar antes de que la transacción del backend termine
        // de escribirse; recargar con un pequeño retraso (y coalescer ráfagas)
        let timer = null;
        const recargarDiferido = () => {
            clearTimeout(timer);
            timer = setTimeout(cargar, 600);
        };

        const token = authStorage.token();
        let unsubCocina, unsubTickets;
        if (token) {
            websocketService.conectar(token);
            unsubCocina = websocketService.subscribe('/topic/cocina', recargarDiferido);
            unsubTickets = websocketService.subscribe('/topic/tickets', recargarDiferido);
        }

        return () => {
            clearTimeout(timer);
            unsubCocina?.();
            unsubTickets?.();
            websocketService.desconectar();
        };
    }, [cargar]);

    // Activas primero (más recientes arriba), entregadas al final
    const ordenadas = useMemo(() => {
        const peso = (e) => (e.estatus === 'PAGADA' ? 1 : 0);
        return [...entregas].sort((a, b) =>
            peso(a) - peso(b) || new Date(b.fechaApertura) - new Date(a.fechaApertura)
        );
    }, [entregas]);

    const activas = useMemo(
        () => entregas.filter(e => e.estatus !== 'PAGADA').length,
        [entregas]
    );

    return { entregas: ordenadas, activas, cargando };
};
