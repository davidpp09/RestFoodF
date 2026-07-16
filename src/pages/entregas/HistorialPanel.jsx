import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RefreshCw, Package, CheckCircle2, Clock, Bike } from 'lucide-react';
import { ordenService } from '@/services/ordenService';

const ESTATUS_CONFIG = {
    PREPARANDO: { icono: Clock,        color: 'text-rf-accent-ink', bg: 'bg-rf-accent-soft', borde: 'border-rf-accent-border',   label: 'En Cocina'  },
    SERVIDO:    { icono: Package,      color: 'text-rf-cyan-ink', bg: 'bg-rf-cyan-soft', borde: 'border-rf-cyan-border',    label: 'Lista/Para llevar'  },
    PAGADA:     { icono: CheckCircle2, color: 'text-rf-green-ink', bg: 'bg-rf-green-soft', borde: 'border-rf-green/30', label: 'Entregada'  },
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
        <div className="bg-rf-surface border border-rf-border rounded-lg shadow-rf-sm overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-rf-surface-2 px-4 py-3 flex items-center justify-between border-b border-rf-border">
                <div>
                    <p className="text-xs text-rf-text-3 font-bold uppercase tracking-widest">Comanda</p>
                    <p className="text-xl font-bold font-mono text-rf-text">#{entrega.numero_comanda ?? entrega.id_orden}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${cfg.bg} border ${cfg.borde}`}>
                        <Icono size={13} className={cfg.color} />
                        <span className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <span className="text-xs text-rf-text-3">{hora}</span>
                </div>
            </div>

            {/* Platillos */}
            <div className="p-4 space-y-2 flex-1">
                {entrega.platillos.map((p, i) => (
                    <div key={i} className="flex items-start gap-3 border-b border-rf-border pb-2 last:border-0 last:pb-0">
                        <span className="bg-rf-accent-soft text-rf-accent-ink font-bold font-mono px-2 py-0.5 rounded-[3px] text-sm min-w-[2rem] text-center">
                            {p.cantidad}x
                        </span>
                        <div className="flex-1">
                            <p className="text-rf-text text-sm font-semibold leading-tight">{p.nombre_producto}</p>
                            {p.comentarios && (
                                <p className="text-rf-text-3 text-xs italic mt-0.5 border-l-2 border-rf-accent-border pl-2">
                                    {p.comentarios}
                                </p>
                            )}
                        </div>
                        <span className="text-rf-text-2 text-sm font-mono">${Number(p.subtotal).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="px-4 py-3 border-t border-rf-border flex justify-between items-center bg-rf-surface-2">
                <span className="text-sm text-rf-text-2 font-bold">Total</span>
                <span className="text-lg font-bold font-mono text-rf-text">${Number(entrega.total).toFixed(2)}</span>
            </div>

            {/* Botón entregar — visible si aún no está entregada */}
            {entrega.estatus !== 'PAGADA' && (
                <div className="px-4 pb-4 pt-2">
                    <button
                        onClick={handleEntregar}
                        disabled={entregando}
                        className="w-full py-2.5 rounded-md bg-rf-green hover:bg-rf-green/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
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
                    <h1 className="text-2xl font-bold text-rf-text">Historial del Día</h1>
                    <p className="text-rf-text-2">
                        {entregas.length} {entregas.length === 1 ? 'orden enviada' : 'órdenes enviadas'} hoy
                    </p>
                </div>
                <button
                    onClick={cargar}
                    disabled={cargando}
                    className="inline-flex items-center gap-2 bg-rf-surface border border-rf-border-strong hover:bg-rf-surface-2 disabled:opacity-50 text-rf-text-2 px-4 py-2 rounded-md transition-colors font-semibold text-sm"
                >
                    <RefreshCw size={16} className={cargando ? 'animate-spin' : ''} />
                    Actualizar
                </button>
            </div>

            {cargando ? (
                <div className="flex items-center justify-center h-48 text-rf-text-3">
                    <RefreshCw size={24} className="animate-spin mr-3" /> Cargando...
                </div>
            ) : entregas.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] gap-4 border border-rf-border-strong rounded-lg">
                    <Package size={48} className="text-rf-text-3" />
                    <p className="text-rf-text-3 font-semibold">No hay órdenes enviadas hoy</p>
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
