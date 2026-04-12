import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import { obtenerRutaPorRol } from '../lib/utils'
export const useAuth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const loginUser = async (email, pass) => {
        setLoading(true);
        try {
            const token = await authService.login(email, pass)
            localStorage.setItem('token_restfood', token);
            const decoded = jwtDecode(token);
            const rol = decoded.role
            const destino = obtenerRutaPorRol(rol);
            navigate(destino);

        } catch (error) {
            const mensajeError = error.response?.data?.mensaje || "Error al iniciar sesión";
            toast.error(mensajeError);
        } finally {
            setLoading(false);
        }
    };
    const logOut = () => {
        localStorage.removeItem('token_restfood');
        toast.success('Sesión finalizada');
        navigate('/login');
    };

    // En tu archivo src/hooks/useAuth.js
    const verifyLogin = () => {
        const token = localStorage.getItem('token_restfood');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (currentTime > decoded.exp) {
                    logOut(); // Usamos tu función de logout que ya limpia y redirige
                }
            } catch (error) {
                // Si el token está mal formado, mejor limpiarlo
                localStorage.removeItem('token_restfood');
                navigate('/login');
            }
        }
    };
    const roleLog = () => {
        try {
            const token = localStorage.getItem('token_restfood');
            const role = jwtDecode(token).role;
            return role;
        } catch (error) {
            const mensajeError = error.response?.data?.mensaje || "Sin Token volver a logearse";
            toast.error(mensajeError);
            navigate('/login')
        }
    }
    const getUsuarioId = () => {
        try {
            const token = localStorage.getItem('token_restfood');
            return jwtDecode(token).id ?? null;
        } catch {
            return null;
        }
    };

    return {
        loginUser,
        logOut,
        verifyLogin,
        roleLog,
        getUsuarioId,
        loading
    };
};