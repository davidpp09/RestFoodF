import { useMesasSala } from '../hooks/useMesasSala';
import { useEntregasVivo } from '../hooks/useEntregasVivo';
import MesaAdmin from '../components/MesaAdmin';
import EntregaAdmin from '../components/EntregaAdmin';
import StatCard from '../components/StatCard';
import WsIndicador from '../components/WsIndicador';
import { CheckCircle2, Clock, Utensils, ShoppingBag, Loader2 } from 'lucide-react';

const AdminPanel = () => {
    const { mesas, stats } = useMesasSala();
    const { entregas, activas, cargando: cargandoEntregas } = useEntregasVivo();

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-end mb-2 shrink-0">
                <WsIndicador />
            </div>
            <div className="grid grid-cols-3 gap-4 landscape:gap-6 mb-5 shrink-0">
                <StatCard color="blue"    label="Total"    value={stats.total}   icon={Utensils}     grande />
                <StatCard color="red"     label="Ocupadas" value={stats.ocupadas} icon={Clock}        grande />
                <StatCard color="emerald" label="Libres"   value={stats.libres}  icon={CheckCircle2} grande />
            </div>

            {/* Pantalla dividida: mesas | para llevar.
                Horizontal: dos columnas. Vertical: dos filas (mitad y mitad) */}
            <div className="flex-1 min-h-0 grid portrait:grid-rows-2 landscape:grid-cols-2 gap-4">
                <section className="flex flex-col min-h-0 rounded-lg bg-rf-surface border border-rf-border shadow-rf-sm overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-rf-border shrink-0">
                        <h3 className="text-[13px] font-bold uppercase tracking-[.14em] text-rf-text-3">Mesas</h3>
                        <div className="flex-1" />
                        <span className="text-[13px] font-semibold text-rf-text-3 font-mono">{stats.ocupadas} / {stats.total}</span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-5 py-4">
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5 content-start pb-2">
                            {mesas.map((mesa) => (
                                <MesaAdmin key={mesa.id_mesa} {...mesa} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="flex flex-col min-h-0 rounded-lg bg-rf-surface border border-rf-border shadow-rf-sm overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-rf-border shrink-0">
                        <h3 className="text-[13px] font-bold uppercase tracking-[.14em] text-rf-text-3">Para Llevar</h3>
                        <span className="inline-flex items-center h-6 px-2.5 rounded-[3px] bg-rf-accent-soft text-rf-accent-ink border border-rf-accent-border text-xs font-bold">
                            {activas} en curso
                        </span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-5 py-4">
                        {cargandoEntregas ? (
                            <div className="flex items-center justify-center h-32 text-rf-text-3 gap-2">
                                <Loader2 size={18} className="animate-spin" /> Cargando...
                            </div>
                        ) : entregas.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 gap-3 border border-rf-border-strong rounded-lg">
                                <ShoppingBag size={32} className="text-rf-text-3" />
                                <p className="text-rf-text-3 font-semibold text-sm">Sin pedidos para llevar hoy</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5 content-start pb-2">
                                {entregas.map((e) => (
                                    <EntregaAdmin key={e.id_orden} entrega={e} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminPanel;
