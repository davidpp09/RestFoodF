import { useState, useEffect, useCallback, useMemo } from 'react';
import { usuarioService } from '../services/usuarioService';
import { mesaService } from '../services/mesaService';
import { toast } from 'sonner';

// Personal y mesas se cargan juntos: la pantalla cruza los dos (cuántas mesas
// tiene cada mesera, de quién es cada mesa).
export const usePersonal = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true);

    const recargar = useCallback(async () => {
        try {
            const [listaUsuarios, listaMesas] = await Promise.all([
                usuarioService.todos(),
                mesaService.gestion(),
            ]);
            setUsuarios(listaUsuarios);
            setMesas(listaMesas);
        } catch (error) {
            toast.error(error.response?.data?.mensaje || "Error al cargar el personal");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        recargar();
    }, [recargar]);

    // Meseras activas, ordenadas por id para que su color no cambie
    const meseras = useMemo(
        () => usuarios
            .filter(u => u.rol === 'MESERO' && u.estatus)
            .sort((a, b) => a.id_usuarios - b.id_usuarios),
        [usuarios]
    );

    const mesasPorUsuario = useMemo(() => {
        const mapa = {};
        mesas.filter(m => m.activa && m.id_usuario_asignado != null).forEach(m => {
            (mapa[m.id_usuario_asignado] ??= []).push(m);
        });
        return mapa;
    }, [mesas]);

    const mesasSinAsignar = useMemo(
        () => mesas.filter(m => m.activa && m.id_usuario_asignado == null),
        [mesas]
    );

    return { usuarios, mesas, meseras, mesasPorUsuario, mesasSinAsignar, loading, recargar };
};
