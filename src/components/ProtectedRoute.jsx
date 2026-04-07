import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { AccessDenied } from './AccessDenied';
import { SUPER_ROLES } from '../constants/roles';

const ProtectedRoute = ({ children, roleRequired }) => {
    const token = localStorage.getItem('token_restfood');
    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role;
        const rolesPermitidos = Array.isArray(roleRequired) ? roleRequired : [roleRequired];
        const esSuperUsuario = SUPER_ROLES.includes(userRole);
        const tienePermiso = rolesPermitidos.includes(userRole);

        if (esSuperUsuario || tienePermiso) {
            return children;
        } else {
            return <AccessDenied roleRequired={roleRequired} />;
        }
    } catch (error) {
        return <Navigate to="/login" />;
    }
};
export default ProtectedRoute