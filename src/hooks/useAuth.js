import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { authStorage } from '../lib/authStorage';
import { toast } from 'sonner';

export const useAuth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const loginUser = async (email, pass) => {
        setLoading(true);
        try {
            const data = await authService.login(email, pass);
            // El backend decide el destino según el rol (single source of truth)
            authStorage.guardar({
                token:        data.jwTtoken,
                rol:          data.rol,
                nombre:       data.nombre,
                id_usuarios:  data.id_usuarios,
                seccion:      data.seccion,
                destino:      data.destino,
            });
            navigate(data.destino || '/login');
        } catch (error) {
            const mensajeError = error.response?.data?.mensaje || "Error al iniciar sesión";
            toast.error(mensajeError);
        } finally {
            setLoading(false);
        }
    };

    const logOut = () => {
        authStorage.limpiar();
        toast.success('Sesión finalizada');
        navigate('/login');
    };

    // Revalida la sesión contra el backend. Si el token es inválido el interceptor
    // de axios limpia y redirige a /login automáticamente.
    const verifyLogin = async () => {
        if (!authStorage.token()) return;
        try {
            const data = await authService.me();
            authStorage.actualizar({
                rol:         data.rol,
                nombre:      data.nombre,
                id_usuarios: data.id_usuarios,
                seccion:     data.seccion,
                destino:     data.destino,
            });
        } catch {
            /* axios ya limpió y redirigió */
        }
    };

    const roleLog     = () => authStorage.rol();
    const getUsuarioId = () => authStorage.idUsuario();
    const getSeccion  = () => authStorage.seccion();

    return {
        loginUser,
        logOut,
        verifyLogin,
        roleLog,
        getUsuarioId,
        getSeccion,
        loading,
    };
};
