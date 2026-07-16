// src/components/EntregaAdmin.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingBag, Clock, Package, CheckCircle2 } from 'lucide-react';

const ESTATUS_CONFIG = {
    PREPARANDO: { icono: Clock,        chip: 'bg-rf-accent-soft text-rf-accent-ink', punto: 'bg-rf-accent', label: 'En Cocina' },
    SERVIDO:    { icono: Package,      chip: 'bg-rf-cyan-soft text-rf-cyan-ink',     punto: 'bg-rf-cyan',   label: 'Lista'     },
    PAGADA:     { icono: CheckCircle2, chip: 'bg-rf-green-soft text-rf-green-ink',   punto: 'bg-rf-green',  label: 'Entregada' },
};

// Tarjeta de solo lectura para el panel admin: ver el pedido, no operarlo
const EntregaAdmin = ({ entrega }) => {
    const cfg = ESTATUS_CONFIG[entrega.estatus] ?? ESTATUS_CONFIG.PREPARANDO;
    const esActiva = entrega.estatus !== 'PAGADA';
    const hora = new Date(entrega.fechaApertura).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    const totalPlatillos = (entrega.platillos ?? []).reduce((acc, p) => acc + p.cantidad, 0);

    return (
        <Dialog>
            <DialogTrigger>
                <div className={`
                    cursor-pointer px-4 py-3.5 rounded-md border transition-all duration-200 h-44 w-full
                    flex flex-col justify-between active:scale-[.985] text-left
                    ${esActiva
                        ? "bg-rf-surface border-rf-border border-l-[3px] border-l-rf-accent shadow-rf-sm"
                        : "bg-rf-surface-2 border-rf-border"}
                `}>
                    <div className="flex justify-between items-center">
                        <span className={`text-[15px] font-bold tracking-[.04em] font-mono ${esActiva ? "text-rf-accent-ink" : "text-rf-text-3"}`}>
                            #{entrega.numero_comanda ?? entrega.id_orden}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 h-[22px] px-2 rounded-[3px] text-[11px] font-bold tracking-[.02em] ${cfg.chip}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.punto}`} />
                            {cfg.label}
                        </span>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-rf-text-3">
                                <ShoppingBag size={13} />
                                <span className="text-xs font-semibold">
                                    {totalPlatillos} {totalPlatillos === 1 ? 'platillo' : 'platillos'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-rf-text-3 font-mono">
                                <Clock size={13} />
                                <span className="text-xs">{hora}</span>
                            </div>
                        </div>
                        <span className="text-xl font-bold font-mono text-rf-text">${Number(entrega.total).toFixed(2)}</span>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="w-[80vw] max-w-[80vw] sm:max-w-[80vw] max-h-[80vh] bg-rf-surface border-rf-border text-rf-text rounded-lg shadow-rf-lg flex flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-4">
                        <div className={`p-3 rounded-md ${cfg.chip}`}>
                            <ShoppingBag size={26} />
                        </div>
                        Para Llevar #{entrega.numero_comanda ?? entrega.id_orden}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-6 space-y-6 flex-1 min-h-0 flex flex-col">
                    <div className="flex justify-between items-center bg-rf-surface-2 p-5 rounded-md border border-rf-border shrink-0">
                        <div>
                            <p className="text-xs font-bold text-rf-text-3 uppercase tracking-[.12em]">Estatus</p>
                            <span className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[3px] text-sm font-bold mt-1.5 ${cfg.chip}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.punto}`} />
                                {cfg.label}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-rf-text-3 uppercase tracking-[.12em]">Hora</p>
                            <p className="text-xl font-bold text-rf-text font-mono mt-1">{hora}</p>
                        </div>
                    </div>

                    <div className="space-y-3 flex-1 min-h-0 flex flex-col">
                        <p className="text-[13px] font-bold text-rf-text-3 uppercase tracking-[.14em] ml-1 shrink-0">Platillos</p>
                        <div className="divide-y divide-rf-border border border-rf-border rounded-md overflow-hidden flex-1 overflow-y-auto custom-scrollbar">
                            {(entrega.platillos ?? []).map((p, i) => (
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
                                    <span className="text-rf-text-2 text-base font-mono">${Number(p.subtotal).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-2 shrink-0">
                        <span className="text-sm font-bold uppercase tracking-[.1em] text-rf-text-3">Total</span>
                        <span className="text-3xl font-bold font-mono text-rf-text">${Number(entrega.total).toFixed(2)}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EntregaAdmin;
