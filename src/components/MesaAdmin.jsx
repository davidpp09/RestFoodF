// src/components/MesaAdmin.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, UtensilsCrossed, Clock } from 'lucide-react';

const MesaAdmin = ({ id_mesa, estado, nombre_mesero, id_orden, platillos = [], fechaApertura }) => {
    const esOcupada = estado === "OCUPADA";
    const total = platillos.reduce((acc, p) => acc + Number(p.subtotal ?? 0), 0);
    const totalPlatillos = platillos.reduce((acc, p) => acc + (p.cantidad ?? 0), 0);
    const hora = fechaApertura
        ? new Date(fechaApertura).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
        : null;

    return (
        <Dialog>
            <DialogTrigger>

                <div className={`
                    cursor-pointer p-5 rounded-2xl border transition-all duration-300 h-44 w-full
                    flex flex-col justify-between active:scale-95 text-left
                    ${esOcupada
                        ? "bg-[#0f172a] border-red-500/40 shadow-lg shadow-red-900/10"
                        : "bg-[#0f172a]/40 border-slate-800/60 shadow-inner"}
                `}>

                    {/* Encabezado de Tarjeta (Fijo) */}
                    <div className="flex justify-between items-center">
                        <span className={`text-xl font-black px-3.5 py-1.5 rounded-xl tracking-tighter
                            ${esOcupada ? "bg-red-500/10 text-red-500" : "bg-slate-800 text-slate-400"}`}>
                            #{id_mesa}
                        </span>

                        {/* Brillo dinámico (se mantiene igual, ayuda visualmente) */}
                        <div className={`w-3.5 h-3.5 rounded-full ${esOcupada
                            ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse"
                            : "bg-slate-700"}`}
                        />
                    </div>

                    {/* Información (Fija) */}
                    {esOcupada ? (
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <User size={16} className="text-slate-500" />
                                    <span className="text-base font-bold uppercase tracking-tight">{nombre_mesero}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <UtensilsCrossed size={14} />
                                    <span className="text-xs font-bold uppercase tracking-widest">
                                        {totalPlatillos} {totalPlatillos === 1 ? 'platillo' : 'platillos'}
                                    </span>
                                </div>
                                {hora && (
                                    <div className="flex items-center gap-2 text-slate-600 font-mono">
                                        <Clock size={13} />
                                        <span className="text-xs">{hora}</span>
                                    </div>
                                )}
                            </div>
                            <span className="text-2xl font-black text-white">${total.toFixed(2)}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2.5 text-slate-600">
                            <UtensilsCrossed size={18} />
                            <span className="text-sm font-bold uppercase tracking-widest">Libre</span>
                        </div>
                    )}
                </div>
            </DialogTrigger>

            {/* Contenido del Modal — 80% de la pantalla */}
            <DialogContent className="w-[80vw] max-w-[80vw] sm:max-w-[80vw] max-h-[80vh] bg-[#0f172a] border-slate-800 text-slate-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                    <DialogTitle className="text-3xl font-black flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${esOcupada ? "bg-red-500/10 text-red-500" : "bg-slate-800 text-slate-400"}`}>
                            <UtensilsCrossed size={28} />
                        </div>
                        Mesa {id_mesa}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-6 space-y-6 flex-1 min-h-0 flex flex-col">
                    {esOcupada ? (
                        <>
                            {/* Bloque de info Orden */}
                            <div className="grid grid-cols-3 gap-4 bg-slate-950/50 p-6 rounded-2xl border border-slate-800 shrink-0">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">ID Orden</p>
                                    <p className="font-mono text-orange-500 text-xl mt-1">#{id_orden}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hora</p>
                                    <p className="text-xl font-bold text-white font-mono mt-1 whitespace-nowrap">{hora ?? '—'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Atiende</p>
                                    <p className="text-xl font-bold text-white mt-1">{nombre_mesero}</p>
                                </div>
                            </div>
                            {/* Lista de Platillos (con scroll táctil) */}
                            <div className="space-y-3 flex-1 min-h-0 flex flex-col">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1 shrink-0">Consumo Actual</p>
                                <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden flex-1 overflow-y-auto custom-scrollbar">
                                    {platillos.map((p, i) => (
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
                                            {p.subtotal != null && (
                                                <span className="text-slate-400 text-base font-mono">${Number(p.subtotal).toFixed(2)}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Total */}
                            <div className="flex justify-between items-center px-2 shrink-0">
                                <span className="text-lg text-slate-400 font-bold">Total</span>
                                <span className="text-3xl font-black text-white">${total.toFixed(2)}</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 space-y-5 m-auto">
                            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto text-slate-600"><UtensilsCrossed size={48} /></div>
                            <p className="text-slate-500 font-medium italic text-lg">Sin actividad</p>
                        </div>
                    )}
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default MesaAdmin;
