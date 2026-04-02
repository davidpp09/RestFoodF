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
        if (userRole === roleRequired || SUPER_ROLES.includes(userRole)) {
            return children;
        } else {
            return <AccessDenied roleRequired={roleRequired} />;
        }

    } catch (error) {
        return <Navigate to="/login" />;
    }
};
export default ProtectedRoute;