import { useState } from 'react';
import { LogOut, Utensils, Menu, X } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CONFIG_MENU } from '@/constants/menuConfig';

const NavItem = ({ opcion, activa, onClick }) => {
    const Icono = opcion.icono;
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                activa
                    ? 'bg-orange-600/10 text-orange-500 border border-orange-600/20 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100 font-medium'
            }`}
        >
            <Icono size={20} />
            <span>{opcion.texto}</span>
        </button>
    );
};

const RestLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logOut, roleLog } = useAuth();
    const [menuAbierto, setMenuAbierto] = useState(false);

    const rol = roleLog();
    const menu = CONFIG_MENU[rol] ?? CONFIG_MENU.ADMIN;
    const tituloActual = menu.find(o => o.ruta === location.pathname)?.texto ?? 'Administración';
    const conMenu = rol !== 'MESERO';

    const irA = (ruta) => {
        setMenuAbierto(false);
        navigate(ruta);
    };

    return (
        <div className="flex h-screen w-full bg-[#020617] text-slate-100 overflow-hidden font-sans">
            {/* Cajón de navegación desplegable (overlay) */}
            {conMenu && (
                <div className={`fixed inset-0 z-50 ${menuAbierto ? '' : 'pointer-events-none'}`}>
                    <div
                        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${menuAbierto ? 'opacity-100' : 'opacity-0'}`}
                        onClick={() => setMenuAbierto(false)}
                    />
                    <aside className={`absolute left-0 top-0 h-full w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col p-6 shadow-2xl
                        transition-transform duration-300 ${menuAbierto ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3 px-2">
                                <div className="bg-orange-600 p-2 rounded-xl shadow-lg shadow-orange-900/20">
                                    <Utensils size={24} className="text-white" />
                                </div>
                                <span className="text-xl font-black tracking-tighter text-white">RESTFOOD</span>
                            </div>
                            <button
                                onClick={() => setMenuAbierto(false)}
                                className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-2 flex-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-3 mb-2">Menú</p>
                            {menu.map((opcion, i) => (
                                <NavItem
                                    key={i}
                                    opcion={opcion}
                                    activa={location.pathname === opcion.ruta}
                                    onClick={() => irA(opcion.ruta)}
                                />
                            ))}
                        </nav>

                        <div className="pt-6 border-t border-slate-800">
                            <button
                                onClick={logOut}
                                className="flex items-center gap-3 p-3 text-slate-400 rounded-xl transition-colors w-full hover:bg-red-500/10 hover:text-red-400"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Cerrar Sesión</span>
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-[#0f172a]/50 backdrop-blur-md border-b border-slate-800 flex items-center gap-4 px-4 landscape:px-6 shrink-0">
                    {conMenu && (
                        <button
                            onClick={() => setMenuAbierto(true)}
                            className="p-2.5 rounded-xl text-slate-300 hover:bg-slate-800 active:scale-95 transition-all"
                            aria-label="Abrir menú"
                        >
                            <Menu size={24} />
                        </button>
                    )}
                    <h2 className="text-xl font-bold text-white">{tituloActual}</h2>
                </header>
                <div className="flex-1 overflow-y-auto p-4 landscape:p-6 custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default RestLayout;
