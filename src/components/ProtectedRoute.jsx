import { Navigate } from 'react-router-dom';
import { AccessDenied } from './AccessDenied';
import { SUPER_ROLES } from '../constants/roles';
import { authStorage } from '../lib/authStorage';

const ProtectedRoute = ({ children, roleRequired }) => {
    const sesion = authStorage.leer();
    if (!sesion?.token || !sesion?.rol) {
        return <Navigate to="/login" />;
    }

    const userRole = sesion.rol;
    const rolesPermitidos = Array.isArray(roleRequired) ? roleRequired : [roleRequired];
    const esSuperUsuario = SUPER_ROLES.includes(userRole);
    const tienePermiso = rolesPermitidos.includes(userRole);

    if (esSuperUsuario || tienePermiso) {
        return children;
    }
    return <AccessDenied roleRequired={roleRequired} />;
};

export default ProtectedRoute;
