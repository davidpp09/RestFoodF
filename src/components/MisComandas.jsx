import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ClipboardList, Loader2, Printer, Utensils, ShoppingBag, Clock, RefreshCw, Ban } from 'lucide-react';
import { ordenService } from '@/services/ordenService';
import { formatearDinero } from '@/lib/utils';
import { toast } from 'sonner';

const ESTATUS_CONFIG = {
    PREPARANDO: { chip: 'bg-rf-accent-soft text-rf-accent-ink', punto: 'bg-rf-accent', label: 'En cocina' },
    SERVIDO:    { chip: 'bg-rf-cyan-soft text-rf-cyan-ink',     punto: 'bg-rf-cyan',   label: 'Servido'   },
    PAGADA:     { chip: 'bg-rf-green-soft text-rf-green-ink',   punto: 'bg-rf-green',  label: 'Pagada'    },
};

const horaDe = (t) => t ? new Date(t).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '';

const ComandaMesera = ({ orden, onReimprimir, reimprimiendo }) => {
    const cfg = ESTATUS_CONFIG[orden.estatus] ?? ESTATUS_CONFIG.PREPARANDO;
    const esLlevar = orden.tipo === 'LLEVAR';
    const Icono = esLlevar ? ShoppingBag : Utensils;
    const destino = esLlevar ? 'Para llevar' : `Mesa ${orden.numeroMesa}`;
    const platillos = orden.platillos ?? [];
    const cancelados = orden.cancelados ?? [];

    return (
        <div className="rounded-md border border-rf-border bg-rf-surface shadow-rf-sm overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-rf-border bg-rf-surface-2">
                <span className="text-[15px] font-bold font-mono text-rf-accent-ink">#{orden.numero_comanda}</span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-rf-text-2">
                    <Icono size={14} /> {destino}
                </span>
                <span className={`inline-flex items-center gap-1.5 h-[22px] px-2 rounded-[3px] text-[11px] font-bold ${cfg.chip}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.punto}`} /> {cfg.label}
                </span>
                <span className="flex items-center gap-1 text-xs text-rf-text-3 font-mono ml-auto">
                    <Clock size={12} /> {horaDe(orden.fechaApertura)}
                </span>
            </div>

            <div className="divide-y divide-rf-border">
                {platillos.length === 0 ? (
                    <p className="text-rf-text-3 text-sm text-center py-4">Sin platillos</p>
                ) : platillos.map((p, i) => (
                    <div key={i} className="flex justify-between items-center px-4 py-2.5">
                        <span className="flex items-center gap-3 text-sm text-rf-text">
                            <span className="flex items-center justify-center w-7 h-7 rounded-[3px] bg-rf-accent-soft text-rf-accent-ink text-xs font-bold font-mono">{p.cantidad}</span>
                            {p.nombre_producto}
                        </span>
                        <span className="text-rf-text-2 text-sm font-mono">{formatearDinero(p.subtotal)}</span>
                    </div>
                ))}
            </div>

            {cancelados.length > 0 && (
                <div className="px-4 py-2 border-t border-rf-red-soft bg-rf-red-soft/30 text-rf-red-ink text-xs font-semibold flex items-center gap-2">
                    <Ban size={13} /> {cancelados.length} platillo{cancelados.length === 1 ? '' : 's'} cancelado{cancelados.length === 1 ? '' : 's'}
                </div>
            )}

            <div className="flex items-center justify-between px-4 py-3 border-t border-rf-border">
                <span className="text-lg font-bold font-mono text-rf-text">{formatearDinero(orden.total)}</span>
                <button
                    onClick={() => onReimprimir(orden.id_orden)}
                    disabled={reimprimiendo}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-rf-accent hover:bg-rf-accent-strong active:scale-[.98] text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {reimprimiendo ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
                    Reimprimir ticket
                </button>
            </div>
        </div>
    );
};

const MisComandas = () => {
    const [abierto, setAbierto] = useState(false);
    const [comandas, setComandas] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [reimprimiendoId, setReimprimiendoId] = useState(null);

    const cargar = useCallback(async () => {
        setCargando(true);
        try {
            setComandas(await ordenService.misComandas());
        } catch (e) {
            console.error('Error al cargar mis comandas:', e);
            toast.error('No se pudieron cargar tus comandas');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        if (abierto) cargar();
    }, [abierto, cargar]);

    const reimprimir = async (idOrden) => {
        if (reimprimiendoId) return;
        setReimprimiendoId(idOrden);
        try {
            await ordenService.reimprimirTicket(idOrden);
            toast.success('Ticket enviado a la impresora');
        } catch (e) {
            console.error('Error al reimprimir:', e);
            toast.error('No se pudo reimprimir el ticket');
        } finally {
            setReimprimiendoId(null);
        }
    };

    return (
        <Dialog open={abierto} onOpenChange={setAbierto}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    aria-label="Mis comandas"
                    className="flex size-11 shrink-0 items-center justify-center rounded-md border border-rf-border bg-rf-surface text-rf-text-3 hover:bg-rf-surface-2 transition-colors cursor-pointer"
                >
                    <ClipboardList size={18} />
                </button>
            </DialogTrigger>

            <DialogContent className="w-[92vw] max-w-[92vw] sm:max-w-[560px] max-h-[85vh] bg-rf-surface border-rf-border text-rf-text rounded-lg shadow-rf-lg flex flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-3">
                        <div className="p-2 rounded-md bg-rf-accent-soft text-rf-accent-ink">
                            <ClipboardList size={22} />
                        </div>
                        Mis comandas de hoy
                        <button
                            onClick={cargar}
                            disabled={cargando}
                            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-rf-border-strong text-rf-text-2 text-xs font-bold hover:bg-rf-surface-2 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw size={13} className={cargando ? 'animate-spin' : ''} /> Actualizar
                        </button>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-3 py-2 pr-1">
                    {cargando ? (
                        <div className="flex flex-col items-center justify-center h-40 text-rf-text-3 gap-2">
                            <Loader2 size={22} className="animate-spin" /> Cargando...
                        </div>
                    ) : comandas.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-rf-text-3 gap-3">
                            <ClipboardList size={32} />
                            <p className="font-semibold text-sm">Aún no tienes comandas hoy</p>
                        </div>
                    ) : (
                        comandas.map((orden) => (
                            <ComandaMesera
                                key={orden.id_orden}
                                orden={orden}
                                onReimprimir={reimprimir}
                                reimprimiendo={reimprimiendoId === orden.id_orden}
                            />
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MisComandas;
