import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Recibimos 'children' (la página) y 'roleRequired' (el permiso necesario)
const ProtectedRoute = ({ children, roleRequired }) => {
    const token = localStorage.getItem('token_restfood');

    // 1. Si no hay token, lo mandamos al login
    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role;

        // 2. Aquí va tu lógica de comparación:
        // Si el 'userRole' es igual al 'roleRequired', mostramos los 'children'
        // Si no coinciden, lo mandamos a una página de error o al login.

        if (userRole === roleRequired) {
            return children;
        } else {
            return <Navigate to="/login" />;
        }

    } catch (error) {
        // Si el token es inválido o falló el decode
        return <Navigate to="/login" />;
    }
};