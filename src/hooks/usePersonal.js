import { useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';
import { toast } from 'sonner'
export const usePersonal = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    const obtenerUsuario = async () => {
        setLoading(true);
        try {
            const datos = await usuarioService.mostrarUsuarios();
            setUsuarios(datos);
        } catch (error) {
            const mensajeError = error.response?.data?.mensaje || "Error al mostrar usuarios";
            toast.error(mensajeError);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        obtenerUsuario();
    }, []);

    return {
        obtenerUsuario,
        loading,
        usuarios,
        error
    };
};