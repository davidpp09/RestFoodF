// src/pages/AdminPanel.jsx
import { useMesasSala } from '../hooks/useMesasSala';
import MesaAdmin from '../components/MesaAdmin';
import { CheckCircle2, Clock, Utensils } from 'lucide-react';

const AdminPanel = () => {
    const { mesas, stats } = useMesasSala();

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {/* Total Mesas */}
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-blue-500/80 text-xs font-bold uppercase tracking-wider mb-1">
                                Total
                            </p>
                            <h3 className="text-3xl font-black text-white">
                                {stats.total}
                            </h3>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Utensils size={24} className="text-blue-500" />
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 text-blue-500/5 rotate-12">
                        <Utensils size={120} />
                    </div>
                </div>

                {/* Mesas Ocupadas */}
                <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-red-500/80 text-xs font-bold uppercase tracking-wider mb-1">
                                Ocupadas
                            </p>
                            <h3 className="text-3xl font-black text-red-500">
                                {stats.ocupadas}
                            </h3>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-xl">
                            <Clock size={24} className="text-red-500" />
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 text-red-500/5 rotate-12">
                        <Clock size={120} />
                    </div>
                </div>

                {/* Mesas Libres */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-emerald-500/80 text-xs font-bold uppercase tracking-wider mb-1">
                                Libres
                            </p>
                            <h3 className="text-3xl font-black text-emerald-500">
                                {stats.libres}
                            </h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-xl">
                            <CheckCircle2 size={24} className="text-emerald-500" />
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 text-emerald-500/5 rotate-12">
                        <CheckCircle2 size={120} />
                    </div>
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