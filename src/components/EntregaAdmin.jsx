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
                    cursor-pointer p-4 rounded-2xl border transition-all duration-300 h-32 w-full
                    flex flex-col justify-between active:scale-95 text-left
                    ${esActiva
                        ? "bg-[#0f172a] border-orange-500/40 shadow-lg shadow-orange-900/10"
                        : "bg-[#0f172a]/40 border-slate-800/60 shadow-inner"}
                `}>
                    <div className="flex justify-between items-center">
                        <span className={`text-sm font-black px-2.5 py-1 rounded-lg tracking-tighter
                            ${esActiva ? "bg-orange-500/10 text-orange-500" : "bg-slate-800 text-slate-400"}`}>
                            #{entrega.numero_comanda ?? entrega.id_orden}
                        </span>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${cfg.bg}`}>
                            <Icono size={12} className={cfg.color} />
                            <span className={`text-[10px] font-bold ${cfg.color}`}>{cfg.label}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-slate-500">
                                <ShoppingBag size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                    {totalPlatillos} {totalPlatillos === 1 ? 'platillo' : 'platillos'}
                                </span>
                            </div>
                            <span className="text-[9px] text-slate-600 font-mono">{hora}</span>
                        </div>
                        <span className="text-base font-black text-white">${Number(entrega.total).toFixed(2)}</span>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[400px] bg-[#0f172a] border-slate-800 text-slate-100 rounded-3xl shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${cfg.bg} ${cfg.color}`}>
                            <ShoppingBag size={20} />
                        </div>
                        Para Llevar #{entrega.numero_comanda ?? entrega.id_orden}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-6 space-y-6">
                    <div className="flex justify-between items-center bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estatus</p>
                            <p className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hora</p>
                            <p className="text-sm font-bold text-white font-mono">{hora}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Platillos</p>
                        <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden max-h-[180px] overflow-y-auto custom-scrollbar">
                            {(entrega.platillos ?? []).map((p, i) => (
                                <div key={i} className="flex justify-between items-center p-3.5 bg-slate-900/30">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-orange-600/20 text-orange-500 text-[10px] font-black">{p.cantidad}</span>
                                        <div>
                                            <span className="text-sm font-medium text-slate-200">{p.nombre_producto}</span>
                                            {p.comentarios && (
                                                <p className="text-slate-500 text-xs italic mt-0.5">{p.comentarios}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-slate-400 text-xs font-mono">${Number(p.subtotal).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-1">
                        <span className="text-sm text-slate-400 font-bold">Total</span>
                        <span className="text-lg font-black text-white">${Number(entrega.total).toFixed(2)}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EntregaAdmin;
