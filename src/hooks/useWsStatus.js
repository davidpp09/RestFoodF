import { useEffect, useState } from 'react';
import websocketService from '../services/websocketService';

export const useWsStatus = () => {
    const [estado, setEstado] = useState(
        websocketService.isConnected ? 'conectado' : 'desconectado'
    );

    useEffect(() => {
        return websocketService.onStatusChange(setEstado);
    }, []);

    return estado;
};
