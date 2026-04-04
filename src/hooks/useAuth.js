import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import {obtenerRutaPorRol} from '../lib/utils'
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
            const mensajeError = error.response?.data?.message || "Error al iniciar sesión";
            toast.error(mensajeError);
        } finally {
            setLoading(false);
        }
    };
    const logout = () => {
        localStorage.removeItem('token_restfood');
        toast.success('Sesión finalizada');
        navigate('/login');
    };
    return {
        loginUser,
        logout,
        loading
    };
};