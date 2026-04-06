// src/pages/AdminPanel.jsx
import { useState, useMemo } from 'react';
import MesaAdmin from '../components/MesaAdmin';
import {
    LayoutDashboard, Users, Utensils, Settings, LogOut, Search, TrendingUp, CheckCircle2, Clock
} from 'lucide-react';

const AdminPanel = () => {
    // Mantenemos el estado simulado por ahora
    const [mesas] = useState(Array.from({ length: 40 }, (_, i) => {
        const id = i + 1;
        const esOcupada = [2, 5, 8, 12, 15].includes(id);
        return {
            id_mesa: id,
            estado: esOcupada ? "OCUPADA" : "LIBRE",
            nombre_mesero: esOcupada ? "Juan Pérez 🏃‍♂️" : "",
            id_orden: esOcupada ? 100 + id : null,
            platillos: esOcupada ? [{ cantidad: 2, nombre: "Tacos al Pastor 🌮" }, { cantidad: 1, nombre: "Coca-Cola 🥤" }] : []
        };
    }));

    const stats = useMemo(() => ({
        total: mesas.length,
        ocupadas: mesas.filter(m => m.estado === 'OCUPADA').length,
        libres: mesas.filter(m => m.estado === 'LIBRE').length
    }), [mesas]);

    return (
        <div className="flex h-screen w-full bg-[#020617] text-slate-100 overflow-hidden font-sans">

            {/* --- SIDEBAR IZQUIERDO (Versión Táctil Estática) --- */}
            <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col p-6 shrink-0">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="bg-orange-600 p-2 rounded-xl shadow-lg shadow-orange-900/20">
                        <Utensils size={24} className="text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white">RESTFOOD</span>
                </div>

                <nav className="flex flex-col gap-2 flex-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-3 mb-2">Menú</p>
                    {/* Botón Activo (se mantiene igual) */}
                    <button className="flex items-center gap-3 p-3 bg-orange-600/10 text-orange-500 rounded-xl transition-all border border-orange-600/20">
                        <LayoutDashboard size={20} /> <span className="font-semibold">Panel de Mesas</span>
                    </button>
                    {/* Botones Estáticos (quitamos hover: clases) */}
                    <button className="flex items-center gap-3 p-3 text-slate-400 rounded-xl transition-colors active:bg-slate-800 active:text-slate-100">
                        <Users size={20} /> <span>Personal</span>
                    </button>
                    <button className="flex items-center gap-3 p-3 text-slate-400 rounded-xl transition-colors active:bg-slate-800 active:text-slate-100">
                        <TrendingUp size={20} /> <span>Reportes</span>
                    </button>
                </nav>

                <div className="pt-6 border-t border-slate-800">
                    <button className="flex items-center gap-3 p-3 text-slate-400 rounded-xl transition-colors w-full active:bg-red-500/10 active:text-red-400">
                        <LogOut size={20} /> <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-[#0f172a]/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-white">Vista de Sala</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Buscador táctil (sin hover, solo focus) */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input type="text" placeholder="Buscar mesa..."
                                className="bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-600/50 transition-all" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {/* Tarjetas de Resumen Estáticas (Iconos sin rotación hover) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                            <div className="flex justify-between items-start relative z-10">
                                <div><p className="text-slate-500 text-xs font-bold uppercase">Total</p><h3 className="text-3xl font-black text-white">{stats.total}</h3></div>
                                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Utensils size={20} /></div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 text-blue-500/5 rotate-12"><Utensils size={100} /></div>
                        </div>
                        <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                            <div className="flex justify-between items-start relative z-10">
                                <div><p className="text-slate-500 text-xs font-bold uppercase">Ocupadas</p><h3 className="text-3xl font-black text-red-500">{stats.ocupadas}</h3></div>
                                <div className="p-3 bg-red-500/10 text-red-500 rounded-xl"><Clock size={20} /></div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 text-red-500/5 rotate-12"><Clock size={100} /></div>
                        </div>
                        <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
                            <div className="flex justify-between items-start relative z-10">
                                <div><p className="text-slate-500 text-xs font-bold uppercase">Libres</p><h3 className="text-3xl font-black text-emerald-500">{stats.libres}</h3></div>
                                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><CheckCircle2 size={20} /></div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 text-emerald-500/5 rotate-12"><CheckCircle2 size={100} /></div>
                        </div>
                    </div>

                    {/* Grid Dinámico de Mesas (Amigable con el tacto) */}
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5 content-start pb-10">
                        {mesas.map((mesa) => (
                            <MesaAdmin key={mesa.id_mesa} {...mesa} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;