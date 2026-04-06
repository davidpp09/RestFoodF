// src/pages/AdminPanel.jsx
import { useState, useEffect, useMemo } from 'react';
import MesaAdmin from '../components/MesaAdmin';
import websocketService from '../services/websocketService';
import { Utensils, LayoutDashboard, Users, TrendingUp, LogOut, Search, CheckCircle2, Clock } from 'lucide-react';

const AdminPanel = () => {
    // Inicializamos las 40 mesas vacías
    const [mesas, setMesas] = useState(
        Array.from({ length: 40 }, (_, i) => ({
            id_mesa: i + 1,
            estado: "LIBRE",
            nombre_mesero: "",
            id_orden: null,
            platillos: []
        }))
    );

    useEffect(() => {
        websocketService.conectar((dato) => {
            setMesas((prevMesas) => {
                return prevMesas.map((mesa) => {
                    // 1. Si llega una apertura de mesa (DatosMesaAbierta)
                    if (dato.id_mesa && mesa.id_mesa === dato.id_mesa) {
                        return { ...mesa, ...dato, estado: "OCUPADA", platillos: [] };
                    }

                    // 2. Si llega un ticket de cocina (DatosTicketCocina)
                    // Buscamos por id_orden porque el ticket no trae el número de mesa
                    if (dato.id_orden && mesa.id_orden === dato.id_orden) {
                        return {
                            ...mesa,
                            // Sumamos los platillos nuevos a los que ya tenía la mesa 🌮+🥗
                            platillos: [...(mesa.platillos || []), ...dato.platillos]
                        };
                    }
                    return mesa;
                });
            });
        });

        return () => websocketService.desconectar();
    }, []);

    const stats = useMemo(() => ({
        total: mesas.length,
        ocupadas: mesas.filter(m => m.estado === 'OCUPADA').length,
        libres: mesas.filter(m => m.estado === 'LIBRE').length
    }), [mesas]);

    return (
        <div className="flex h-screen w-full bg-[#020617] text-slate-100 overflow-hidden font-sans">
            {/* Sidebar y Header (Igual que antes) */}
            <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col p-6 shrink-0">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="bg-orange-600 p-2 rounded-xl shadow-lg shadow-orange-900/20">
                        <Utensils size={24} className="text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white">RESTFOOD</span>
                </div>
                <nav className="flex flex-col gap-2 flex-1">
                    <button className="flex items-center gap-3 p-3 bg-orange-600/10 text-orange-500 rounded-xl border border-orange-600/20">
                        <LayoutDashboard size={20} /> <span className="font-semibold">Panel de Mesas</span>
                    </button>
                    <button className="flex items-center gap-3 p-3 text-slate-400 rounded-xl active:bg-slate-800"><Users size={20} /> <span>Personal</span></button>
                    <button className="flex items-center gap-3 p-3 text-slate-400 rounded-xl active:bg-slate-800"><TrendingUp size={20} /> <span>Reportes</span></button>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-[#0f172a]/50 border-b border-slate-800 flex items-center justify-between px-8">
                    <h2 className="text-xl font-bold">Monitor en Tiempo Real 📡</h2>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {/* Estadísticas dinámicas */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800">
                            <p className="text-slate-500 text-xs font-bold uppercase">Mesas Libres</p>
                            <h3 className="text-3xl font-black text-emerald-500">{stats.libres}</h3>
                        </div>
                        <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800">
                            <p className="text-slate-500 text-xs font-bold uppercase">Mesas Ocupadas</p>
                            <h3 className="text-3xl font-black text-red-500">{stats.ocupadas}</h3>
                        </div>
                    </div>

                    {/* Grid de Mesas */}
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5">
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