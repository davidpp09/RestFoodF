import { useMesasSala } from '../hooks/useMesasSala';
import { useEntregasVivo } from '../hooks/useEntregasVivo';
import MesaAdmin from '../components/MesaAdmin';
import EntregaAdmin from '../components/EntregaAdmin';
import StatCard from '../components/StatCard';
import WsIndicador from '../components/WsIndicador';
import { CheckCircle2, Clock, Utensils, ShoppingBag, Loader2 } from 'lucide-react';

const TituloSeccion = ({ icono: Icono, texto, badge }) => (
    <div className="flex items-center gap-3 mb-4 shrink-0">
        <Icono size={22} className="text-orange-500" />
        <h3 className="text-lg font-black text-white uppercase tracking-widest">{texto}</h3>
        {badge != null && (
            <span className="text-sm font-black bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full">
                {badge}
            </span>
        )}
    </div>
);

const AdminPanel = () => {
    const { mesas, stats } = useMesasSala();
    const { entregas, activas, cargando: cargandoEntregas } = useEntregasVivo();

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-end mb-2 shrink-0">
                <WsIndicador />
            </div>
            <div className="grid grid-cols-3 gap-4 landscape:gap-6 mb-6 shrink-0">
                <StatCard color="blue"    label="Total"    value={stats.total}   icon={Utensils}     grande />
                <StatCard color="red"     label="Ocupadas" value={stats.ocupadas} icon={Clock}        grande />
                <StatCard color="emerald" label="Libres"   value={stats.libres}  icon={CheckCircle2} grande />
            </div>

            {/* Pantalla dividida: mesas | para llevar.
                Horizontal: dos columnas. Vertical: dos filas (mitad y mitad) */}
            <div className="flex-1 min-h-0 grid portrait:grid-rows-2 landscape:grid-cols-2 gap-6">
                <section className="flex flex-col min-h-0">
                    <TituloSeccion icono={Utensils} texto="Mesas" />
                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5 content-start pb-4">
                            {mesas.map((mesa) => (
                                <MesaAdmin key={mesa.id_mesa} {...mesa} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="flex flex-col min-h-0 portrait:border-t landscape:border-t-0 landscape:border-l border-slate-800 portrait:pt-4 landscape:pl-6">
                    <TituloSeccion icono={ShoppingBag} texto="Para Llevar" badge={`${activas} en curso`} />
                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
                        {cargandoEntregas ? (
                            <div className="flex items-center justify-center h-32 text-slate-500 gap-2">
                                <Loader2 size={18} className="animate-spin" /> Cargando...
                            </div>
                        ) : entregas.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 gap-3 border-2 border-dashed border-slate-800 rounded-3xl">
                                <ShoppingBag size={32} className="text-slate-700" />
                                <p className="text-slate-500 font-semibold text-sm">Sin pedidos para llevar hoy</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5 content-start pb-4">
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
