import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Utensils, ShoppingBag, Clock, CheckCircle2, Package, Coffee, Sun } from 'lucide-react';
import { formatearDinero } from '@/lib/utils';

const ESTATUS_CONFIG = {
    PREPARANDO: { chip: 'bg-rf-accent-soft text-rf-accent-ink', punto: 'bg-rf-accent', label: 'En cocina' },
    SERVIDO:    { chip: 'bg-rf-cyan-soft text-rf-cyan-ink',     punto: 'bg-rf-cyan',   label: 'Servido'   },
    PAGADA:     { chip: 'bg-rf-green-soft text-rf-green-ink',   punto: 'bg-rf-green',  label: 'Pagada'    },
};

const SERVICIO_LABEL = { DESAYUNO: 'Desayuno', COMIDA: 'Comida' };

// Tarjeta de solo lectura: revisar una comanda/orden capturada por un empleado.
const ComandaCard = ({ orden }) => {
    const cfg = ESTATUS_CONFIG[orden.estatus] ?? ESTATUS_CONFIG.PREPARANDO;
    const esLlevar = orden.tipo === 'LLEVAR';
    const Icono = esLlevar ? ShoppingBag : Utensils;
    const hora = new Date(orden.fechaApertura).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    const platillos = orden.platillos ?? [];
    const totalPlatillos = platillos.reduce((acc, p) => acc + p.cantidad, 0);
    const destino = esLlevar ? 'Para llevar' : `Mesa ${orden.numeroMesa}`;
    const ServIcono = orden.servicio === 'DESAYUNO' ? Coffee : Sun;

    return (
        <Dialog>
            <DialogTrigger>
                <div className="cursor-pointer px-4 py-3.5 rounded-md border border-rf-border border-l-[3px] border-l-rf-accent
                    bg-rf-surface shadow-rf-sm transition-all duration-200 h-44 w-full
                    flex flex-col justify-between active:scale-[.985] text-left">
                    <div className="flex justify-between items-center">
                        <span className="text-[15px] font-bold tracking-[.04em] font-mono text-rf-accent-ink">
                            #{orden.numero_comanda}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 h-[22px] px-2 rounded-[3px] text-[11px] font-bold tracking-[.02em] ${cfg.chip}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.punto}`} />
                            {cfg.label}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-rf-text-2">
                        <Icono size={13} className="shrink-0" />
                        <span className="text-xs font-bold truncate">{destino}</span>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-rf-text-3">
                                <Package size={13} />
                                <span className="text-xs font-semibold">
                                    {totalPlatillos} {totalPlatillos === 1 ? 'platillo' : 'platillos'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-rf-text-3 font-mono">
                                <Clock size={13} />
                                <span className="text-xs">{hora}</span>
                            </div>
                        </div>
                        <span className="text-xl font-bold font-mono text-rf-text">{formatearDinero(orden.total)}</span>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="w-[80vw] max-w-[80vw] sm:max-w-[80vw] max-h-[80vh] bg-rf-surface border-rf-border text-rf-text rounded-lg shadow-rf-lg flex flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-4">
                        <div className={`p-3 rounded-md ${cfg.chip}`}>
                            <Icono size={26} />
                        </div>
                        Comanda #{orden.numero_comanda}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-6 space-y-6 flex-1 min-h-0 flex flex-col">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-rf-surface-2 p-5 rounded-md border border-rf-border shrink-0">
                        <div>
                            <p className="text-xs font-bold text-rf-text-3 uppercase tracking-[.12em]">Destino</p>
                            <p className="text-base font-bold text-rf-text mt-1.5 flex items-center gap-1.5">
                                <Icono size={16} className="text-rf-text-2" />
                                {destino}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-rf-text-3 uppercase tracking-[.12em]">Servicio</p>
                            <p className="text-base font-bold text-rf-text mt-1.5 flex items-center gap-1.5">
                                <ServIcono size={16} className="text-rf-text-2" />
                                {SERVICIO_LABEL[orden.servicio] ?? orden.servicio}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-rf-text-3 uppercase tracking-[.12em]">Estatus</p>
                            <span className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[3px] text-sm font-bold mt-1.5 ${cfg.chip}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.punto}`} />
                                {cfg.label}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-rf-text-3 uppercase tracking-[.12em]">Hora</p>
                            <p className="text-xl font-bold text-rf-text font-mono mt-1">{hora}</p>
                        </div>
                    </div>

                    <div className="space-y-3 flex-1 min-h-0 flex flex-col">
                        <p className="text-[13px] font-bold text-rf-text-3 uppercase tracking-[.14em] ml-1 shrink-0">Platillos</p>
                        <div className="divide-y divide-rf-border border border-rf-border rounded-md overflow-hidden flex-1 overflow-y-auto custom-scrollbar">
                            {platillos.length === 0 ? (
                                <p className="text-rf-text-3 text-sm text-center py-8">Sin platillos</p>
                            ) : platillos.map((p, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-rf-surface">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center justify-center w-9 h-9 rounded-[3px] bg-rf-accent-soft text-rf-accent-ink text-sm font-bold font-mono">{p.cantidad}</span>
                                        <div>
                                            <span className="text-base font-medium text-rf-text">{p.nombre_producto}</span>
                                            {p.comentarios && (
                                                <p className="text-rf-text-3 text-sm italic mt-0.5">{p.comentarios}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-rf-text-2 text-base font-mono">{formatearDinero(p.subtotal)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-2 shrink-0">
                        <span className="text-sm font-bold uppercase tracking-[.1em] text-rf-text-3">Total</span>
                        <span className="text-3xl font-bold font-mono text-rf-text">{formatearDinero(orden.total)}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ComandaCard;
