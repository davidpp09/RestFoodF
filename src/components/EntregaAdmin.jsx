// src/components/EntregaAdmin.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingBag, Clock, Package, CheckCircle2 } from 'lucide-react';

const ESTATUS_CONFIG = {
    PREPARANDO: { icono: Clock,        color: 'text-amber-400',   bg: 'bg-amber-500/10',   label: 'En Cocina' },
    SERVIDO:    { icono: Package,      color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    label: 'Lista'     },
    PAGADA:     { icono: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Entregada' },
};

// Tarjeta de solo lectura para el panel admin: ver el pedido, no operarlo
const EntregaAdmin = ({ entrega }) => {
    const cfg = ESTATUS_CONFIG[entrega.estatus] ?? ESTATUS_CONFIG.PREPARANDO;
    const Icono = cfg.icono;
    const esActiva = entrega.estatus !== 'PAGADA';
    const hora = new Date(entrega.fechaApertura).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    const totalPlatillos = (entrega.platillos ?? []).reduce((acc, p) => acc + p.cantidad, 0);

    return (
        <Dialog>
            <DialogTrigger>
                <div className={`
                    cursor-pointer p-5 rounded-2xl border transition-all duration-300 h-44 w-full
                    flex flex-col justify-between active:scale-95 text-left
                    ${esActiva
                        ? "bg-[#0f172a] border-orange-500/40 shadow-lg shadow-orange-900/10"
                        : "bg-[#0f172a]/40 border-slate-800/60 shadow-inner"}
                `}>
                    <div className="flex justify-between items-center">
                        <span className={`text-xl font-black px-3.5 py-1.5 rounded-xl tracking-tighter
                            ${esActiva ? "bg-orange-500/10 text-orange-500" : "bg-slate-800 text-slate-400"}`}>
                            #{entrega.numero_comanda ?? entrega.id_orden}
                        </span>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${cfg.bg}`}>
                            <Icono size={15} className={cfg.color} />
                            <span className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-slate-500">
                                <ShoppingBag size={14} />
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    {totalPlatillos} {totalPlatillos === 1 ? 'platillo' : 'platillos'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 font-mono">
                                <Clock size={13} />
                                <span className="text-xs">{hora}</span>
                            </div>
                        </div>
                        <span className="text-2xl font-black text-white">${Number(entrega.total).toFixed(2)}</span>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="w-[80vw] max-w-[80vw] sm:max-w-[80vw] max-h-[80vh] bg-[#0f172a] border-slate-800 text-slate-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                    <DialogTitle className="text-3xl font-black flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${cfg.bg} ${cfg.color}`}>
                            <ShoppingBag size={28} />
                        </div>
                        Para Llevar #{entrega.numero_comanda ?? entrega.id_orden}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-6 space-y-6 flex-1 min-h-0 flex flex-col">
                    <div className="flex justify-between items-center bg-slate-950/50 p-6 rounded-2xl border border-slate-800 shrink-0">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estatus</p>
                            <p className={`text-xl font-bold ${cfg.color} mt-1`}>{cfg.label}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hora</p>
                            <p className="text-xl font-bold text-white font-mono mt-1">{hora}</p>
                        </div>
                    </div>

                    <div className="space-y-3 flex-1 min-h-0 flex flex-col">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1 shrink-0">Platillos</p>
                        <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden flex-1 overflow-y-auto custom-scrollbar">
                            {(entrega.platillos ?? []).map((p, i) => (
                                <div key={i} className="flex justify-between items-center p-5 bg-slate-900/30">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-600/20 text-orange-500 text-sm font-black">{p.cantidad}</span>
                                        <div>
                                            <span className="text-lg font-medium text-slate-200">{p.nombre_producto}</span>
                                            {p.comentarios && (
                                                <p className="text-slate-500 text-sm italic mt-0.5">{p.comentarios}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-slate-400 text-base font-mono">${Number(p.subtotal).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-2 shrink-0">
                        <span className="text-lg text-slate-400 font-bold">Total</span>
                        <span className="text-3xl font-black text-white">${Number(entrega.total).toFixed(2)}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EntregaAdmin;
