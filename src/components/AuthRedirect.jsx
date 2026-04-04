import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { obtenerRutaPorRol } from "@/lib/utils";
import { toast } from "sonner";

const AuthRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        try {

            const token = localStorage.getItem('token_restfood')
            if (token) {
                const decoded = jwtDecode(token);
                const rol = decoded.role
                const destino = obtenerRutaPorRol(rol);
                navigate(destino);
            } else {
                navigate('/login');
            }
        } catch (error) {
            localStorage.removeItem('token_restfood');
            toast.error('Sesión inválida o expirada');
            navigate('/login');
        }
    }, []);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-50">
            {/* El icono gira gracias a la clase animate-spin */}
            <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
            <div className="space-y-2 text-center">
                <h2 className="text-xl font-semibold text-slate-900">RestFood</h2>
                <p className="text-sm text-slate-500 animate-pulse">
                    Verificando tu sesión, por favor espera...
                </p>
            </div>
        </div>
    );
}
export default AuthRedirect;