// src/pages/AdminPanel.jsx
import { useMesasSala } from '../hooks/useMesasSala';
import MesaAdmin from '../components/MesaAdmin';
import { CheckCircle2, Clock, Utensils } from 'lucide-react';

const AdminPanel = () => {
    const { mesas, stats } = useMesasSala();

    return (
        <>
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

            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5 content-start pb-10">
                {mesas.map((mesa) => (
                    <MesaAdmin key={mesa.id_mesa} {...mesa} />
                ))}
            </div>
        </>
    );
};

export default AdminPanel;