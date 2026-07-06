import { Navigate } from 'react-router-dom';
import { AccessDenied } from './AccessDenied';
import { authStorage } from '../lib/authStorage';

const ProtectedRoute = ({ children, roleRequired }) => {
    const sesion = authStorage.leer();
    if (!sesion?.token || !sesion?.rol) {
        return <Navigate to="/login" />;
    }

    // roleRequired es la única fuente de verdad: las rutas que admiten ADMIN/DEV
    // ya los listan explícitamente (ver App.jsx). Sin bypass de super-roles, para
    // que las pantallas solo-DEV (p. ej. /admin/platillos) coincidan con los
    // permisos reales del backend.
    const rolesPermitidos = Array.isArray(roleRequired) ? roleRequired : [roleRequired];

    if (rolesPermitidos.includes(sesion.rol)) {
        return children;
    }
    return <AccessDenied roleRequired={roleRequired} />;
};

export default ProtectedRoute;
