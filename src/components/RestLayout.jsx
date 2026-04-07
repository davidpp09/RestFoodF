// src/components/RestLayout.jsx
import { LogOut, Utensils } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SUPER_ROLES } from '@/constants/roles';
import { CONFIG_MENU } from '@/lib/utils';
const RestLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logOut, roleLog } = useAuth();

    const rol = roleLog();
    const menuAMostrar = (SUPER_ROLES.includes(rol))
        ? CONFIG_MENU.SUPER_ROLES
        : CONFIG_MENU[rol] || [];

    const tituloActual = menuAMostrar.find(opcion => opcion.ruta === location.pathname)?.texto || "Administración";

    return (
        <div className="flex h-screen w-full bg-[#020617] text-slate-100 overflow-hidden font-sans">
            <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col p-6 shrink-0">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="bg-orange-600 p-2 rounded-xl shadow-lg shadow-orange-900/20">
                        <Utensils size={24} className="text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white">RESTFOOD</span>
                </div>
                <nav className="flex flex-col gap-2 flex-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-3 mb-2">Menú</p>

                    {/* 👇 Ahora mapeamos opcionesMenu */}
                    {menuAMostrar.map((opcion, index) => {
                        const Icono = opcion.icono;
                        // 👇 Evaluamos si la ruta del botón es igual a la URL actual
                        const isActive = location.pathname === opcion.ruta;

                        return (
                            <button
                                key={index}
                                onClick={() => navigate(opcion.ruta)}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive // 👈 Usamos nuestra nueva variable matemática
                                    ? "bg-orange-600/10 text-orange-500 border border-orange-600/20 font-semibold"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100 font-medium"
                                    }`}
                            >
                                <Icono size={20} />
                                <span>{opcion.texto}</span>
                            </button>
                        );
                    })}
                </nav>
                <div className="pt-6 border-t border-slate-800">
                    <button onClick={() => logOut()} className="flex items-center gap-3 p-3 text-slate-400 rounded-xl transition-colors w-full hover:bg-red-500/10 hover:text-red-400">
                        <LogOut size={20} /> <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-[#0f172a]/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 shrink-0">
                    <h2 className="text-xl font-bold text-white">{tituloActual}</h2>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default RestLayout;