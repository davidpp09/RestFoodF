import { useState } from 'react';
import { LogOut, Utensils, Menu, X } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CONFIG_MENU } from '@/constants/menuConfig';
import ThemeToggle from '@/components/ThemeToggle';
import MisComandas from '@/components/MisComandas';

const NavItem = ({ opcion, activa, onClick }) => {
    const Icono = opcion.icono;
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 p-3 rounded-md transition-all ${
                activa
                    ? 'bg-rf-accent-soft text-rf-accent-ink font-semibold'
                    : 'text-rf-text-2 hover:bg-rf-surface-2 hover:text-rf-text font-medium'
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
        <div className="flex h-screen w-full bg-rf-bg text-rf-text overflow-hidden font-sans">
            {/* Cajón de navegación desplegable (overlay) */}
            {conMenu && (
                <div className={`fixed inset-0 z-50 ${menuAbierto ? '' : 'pointer-events-none'}`}>
                    <div
                        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${menuAbierto ? 'opacity-100' : 'opacity-0'}`}
                        onClick={() => setMenuAbierto(false)}
                    />
                    <aside className={`absolute left-0 top-0 h-full w-64 bg-rf-surface border-r border-rf-border flex flex-col p-6 shadow-rf-lg
                        transition-transform duration-300 ${menuAbierto ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3 px-2">
                                <div className="flex size-10 items-center justify-center rounded-md bg-rf-accent text-white">
                                    <Utensils size={20} />
                                </div>
                                <span className="text-lg font-bold tracking-[.14em] text-rf-text">RESTFOOD</span>
                            </div>
                            <button
                                onClick={() => setMenuAbierto(false)}
                                className="p-2 rounded-md text-rf-text-3 hover:bg-rf-surface-2 hover:text-rf-text transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-1.5 flex-1">
                            <p className="text-[10px] font-bold text-rf-text-3 uppercase tracking-widest ml-3 mb-2">Menú</p>
                            {menu.map((opcion, i) => (
                                <NavItem
                                    key={i}
                                    opcion={opcion}
                                    activa={location.pathname === opcion.ruta}
                                    onClick={() => irA(opcion.ruta)}
                                />
                            ))}
                        </nav>

                        <div className="pt-6 border-t border-rf-border">
                            <button
                                onClick={logOut}
                                className="flex items-center gap-3 p-3 text-rf-text-2 rounded-md transition-colors w-full hover:bg-rf-red-soft hover:text-rf-red-ink"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Cerrar Sesión</span>
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-rf-surface border-b border-rf-border shadow-rf-sm flex items-center gap-3 px-4 landscape:px-6 shrink-0">
                    {conMenu && (
                        <button
                            onClick={() => setMenuAbierto(true)}
                            className="p-2.5 rounded-md text-rf-text-2 hover:bg-rf-surface-2 active:scale-[.97] transition-all"
                            aria-label="Abrir menú"
                        >
                            <Menu size={22} />
                        </button>
                    )}
                    <h2 className="text-xl font-bold text-rf-text">{tituloActual}</h2>
                    <div className="flex-1" />
                    {rol === 'MESERO' && <MisComandas />}
                    <ThemeToggle />
                </header>
                <div className="flex-1 overflow-y-auto p-4 landscape:p-6 custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default RestLayout;
