import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RefreshCw, Package, CheckCircle2, Clock, Bike } from 'lucide-react';
import { ordenService } from '@/services/ordenService';

const ESTATUS_CONFIG = {
    PREPARANDO: { icono: Clock,        color: 'text-amber-400',   bg: 'bg-amber-500/10',   borde: 'border-amber-500/20',   label: 'En Cocina'  },
    SERVIDO:    { icono: Package,      color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    borde: 'border-cyan-500/20',    label: 'Lista/Para llevar'  },
    PAGADA:     { icono: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', borde: 'border-emerald-500/20', label: 'Entregada'  },
};

const TarjetaEntrega = ({ entrega, onEntregar }) => {
    const [entregando, setEntregando] = useState(false);
    const cfg   = ESTATUS_CONFIG[entrega.estatus] ?? ESTATUS_CONFIG.PREPARANDO;
    const Icono = cfg.icono;
    const hora  = new Date(entrega.fechaApertura).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    const handleEntregar = async () => {
        setEntregando(true);
        try {
            await ordenService.cerrarOrden(entrega.id_orden);
            onEntregar(entrega.id_orden);
            toast.success(`Comanda #${entrega.numero_comanda ?? entrega.id_orden} marcada como entregada`);
        } catch {
            toast.error('Error al marcar la orden como entregada');
        } finally {
            setEntregando(false);
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
                <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Comanda</p>
                    <p className="text-xl font-black text-white">#{entrega.numero_comanda ?? entrega.id_orden}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${cfg.bg} border ${cfg.borde}`}>
                        <Icono size={13} className={cfg.color} />
                        <span className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <span className="text-xs text-slate-500">{hora}</span>
                </div>
            </div>

            {/* Platillos */}
            <div className="p-4 space-y-2 flex-1">
                {entrega.platillos.map((p, i) => (
                    <div key={i} className="flex items-start gap-3 border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                        <span className="bg-slate-800 text-orange-400 font-black px-2 py-0.5 rounded text-sm min-w-[2rem] text-center">
                            {p.cantidad}x
                        </span>
                        <div className="flex-1">
                            <p className="text-slate-200 text-sm font-semibold leading-tight">{p.nombre_producto}</p>
                            {p.comentarios && (
                                <p className="text-slate-500 text-xs italic mt-0.5 border-l-2 border-orange-500/40 pl-2">
                                    {p.comentarios}
                                </p>
                            )}
                        </div>
                        <span className="text-slate-400 text-sm font-mono">${Number(p.subtotal).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="px-4 py-3 border-t border-slate-800 flex justify-between items-center bg-slate-900/50">
                <span className="text-sm text-slate-400 font-bold">Total</span>
                <span className="text-lg font-black text-white">${Number(entrega.total).toFixed(2)}</span>
            </div>

            {/* Botón entregar — visible si aún no está entregada */}
            {entrega.estatus !== 'PAGADA' && (
                <div className="px-4 pb-4 pt-2">
                    <button
                        onClick={handleEntregar}
                        disabled={entregando}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        {entregando
                            ? <><RefreshCw size={14} className="animate-spin" /> Procesando...</>
                            : <><Bike size={14} /> Marcar como Entregada</>}
                    </button>
                </div>
            )}
        </div>
    );
};

const HistorialPanel = () => {
    const [entregas, setEntregas] = useState([]);
    const [cargando, setCargando] = useState(true);

    const cargar = async () => {
        setCargando(true);
        try {
            const data = await ordenService.obtenerEntregasHoy();
            setEntregas(data);
        } catch {
            toast.error('Error al cargar el historial');
        } finally {
            setCargando(false);
        }
    };

    const marcarEntregada = (id_orden) => {
        setEntregas(prev =>
            prev.map(e => e.id_orden === id_orden ? { ...e, estatus: 'PAGADA' } : e)
        );
    };

    useEffect(() => { cargar(); }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Historial del Día</h1>
                    <p className="text-slate-400">
                        {entregas.length} {entregas.length === 1 ? 'orden enviada' : 'órdenes enviadas'} hoy
                    </p>
                </div>
                <button
                    onClick={cargar}
                    disabled={cargando}
                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
                >
                    <RefreshCw size={16} className={cargando ? 'animate-spin' : ''} />
                    Actualizar
                </button>
            </div>

            {cargando ? (
                <div className="flex items-center justify-center h-48 text-slate-500">
                    <RefreshCw size={24} className="animate-spin mr-3" /> Cargando...
                </div>
            ) : entregas.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] gap-4 border-2 border-dashed border-slate-800 rounded-3xl">
                    <Package size={48} className="text-slate-700" />
                    <p className="text-slate-500 font-semibold">No hay órdenes enviadas hoy</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {entregas.map(e => <TarjetaEntrega key={e.id_orden} entrega={e} onEntregar={marcarEntregada} />)}
                </div>
            )}
        </div>
    );
};

export default HistorialPanel;
