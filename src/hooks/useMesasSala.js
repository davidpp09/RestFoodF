// src/hooks/useMesasSala.js
import { useState, useEffect, useMemo } from 'react';
import websocketService from '../services/websocketService';

export const useMesasSala = () => {
    const STORAGE_KEY = 'admin_mesas_state';

    // 1. Estado inicial
    const [mesas, setMesas] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { console.error(e); }
        }
        return Array.from({ length: 40 }, (_, i) => ({
            id_mesa: i + 1, estado: "LIBRE", nombre_mesero: "", id_orden: null, platillos: []
        }));
    });

    // 2. Guardado automático
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mesas));
    }, [mesas]);

    // 3. Conexión WebSocket 📡
    useEffect(() => {
        const token = localStorage.getItem('token_restfood'); // 🔑 Aquí pedimos el gafete
        if (!token) {
            console.error("No hay sesión iniciada.");
            return;
        }

        const onMesaActualizada = (mesaActualizada) => {
            setMesas((prevMesas) => {
                let hizoMatch = false;
                const nuevasMesas = prevMesas.map((mesa) => {
                    // Lógica de apertura/cierre
                    if (mesaActualizada.id_mesa && mesa.id_mesa == mesaActualizada.id_mesa) {
                        if (mesaActualizada.estado === 'OCUPADA' && mesa.estado === 'LIBRE') {
                            return { ...mesa, ...mesaActualizada, platillos: [] };
                        }
                        if (mesaActualizada.estado === 'LIBRE') {
                            return { ...mesa, estado: 'LIBRE', nombre_mesero: '', id_orden: null, platillos: [] };
                        }
                        return { ...mesa, ...mesaActualizada, platillos: mesaActualizada.platillos || mesa.platillos || [] };
                    }
                    // Lógica de tickets de cocina
                    if (!mesaActualizada.id_mesa && mesaActualizada.id_orden) {
                        if (mesa.id_orden == mesaActualizada.id_orden) {
                            hizoMatch = true;
                            return { ...mesa, platillos: [...(mesa.platillos || []), ...(mesaActualizada.platillos || [])] };
                        }
                    }
                    return mesa;
                });
                return nuevasMesas;
            });
        };

        websocketService.conectar(token, onMesaActualizada);
        return () => websocketService.desconectar();
    }, []);

    // 4. Estadísticas
    const stats = useMemo(() => ({
        total: mesas.length,
        ocupadas: mesas.filter(m => m.estado === 'OCUPADA').length,
        libres: mesas.filter(m => m.estado === 'LIBRE').length
    }), [mesas]);

    // 5. Entregamos los datos limpios al UI
    return { mesas, stats };
};