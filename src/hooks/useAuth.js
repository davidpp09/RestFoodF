import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';

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
            const rutasPorRol = {
                DEV: "/admin-dashboard",
                MESERO: "/pedidos",
                COCINA: "/cocina-panel",
                REPARTIDOR: "/entregas"
            };
            const destino = rutasPorRol[rol] || "/login";
            toast.success(`¡Bienvenido! Entrando como ${rol}`);
            navigate(destino);

        } catch (error) {
            const mensajeError = error.response?.data?.message || "Error al iniciar sesión";
            toast.error(mensajeError);
        } finally {
            setLoading(false);
        }
    };
    return {
        loginUser,
        loading
    };
};