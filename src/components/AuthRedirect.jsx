import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authStorage } from "@/lib/authStorage";

const AuthRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const sesion = authStorage.leer();
        if (sesion?.token && sesion?.destino) {
            navigate(sesion.destino);
        } else {
            navigate('/login');
        }
    }, []);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-50">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
            <div className="space-y-2 text-center">
                <h2 className="text-xl font-semibold text-slate-900">RestFood</h2>
                <p className="text-sm text-slate-500 animate-pulse">
                    Verificando tu sesión, por favor espera...
                </p>
            </div>
        </div>
    );
};
export default AuthRedirect;
