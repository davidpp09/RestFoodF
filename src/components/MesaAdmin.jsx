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
                    cursor-pointer px-4 py-3.5 rounded-md border transition-all duration-200 h-44 w-full
                    flex flex-col justify-between active:scale-[.985] text-left
                    ${esOcupada
                        ? "bg-rf-surface border-rf-border border-l-[3px] border-l-rf-red shadow-rf-sm"
                        : "bg-rf-surface-2 border-rf-border"}
                `}>

                    {/* Encabezado de Tarjeta (Fijo) */}
                    <div className="flex justify-between items-center gap-2 min-w-0">
                        <span className={`text-[15px] font-bold tracking-[.04em] font-mono truncate ${esOcupada ? "text-rf-text" : "text-rf-text-3"}`}>
                            MESA {id_mesa}
                        </span>
                        {esOcupada && (
                            <span className="inline-flex items-center h-[22px] px-2 rounded-[3px] bg-rf-red-soft text-rf-red-ink text-[11px] font-bold tracking-[.06em] shrink-0 whitespace-nowrap">
                                OCUPADA
                            </span>
                        )}
                    </div>

                    {/* Información (Fija) */}
                    {esOcupada ? (
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-rf-text-2">
                                    <User size={15} className="text-rf-text-3" />
                                    <span className="text-sm font-semibold uppercase tracking-tight">{nombre_mesero}</span>
                                </div>
                                <div className="flex items-center gap-2 text-rf-text-3">
                                    <UtensilsCrossed size={13} />
                                    <span className="text-xs font-semibold">
                                        {totalPlatillos} {totalPlatillos === 1 ? 'platillo' : 'platillos'}
                                    </span>
                                </div>
                                {hora && (
                                    <div className="flex items-center gap-2 text-rf-text-3 font-mono">
                                        <Clock size={13} />
                                        <span className="text-xs">{hora}</span>
                                    </div>
                                )}
                            </div>
                            <span className="text-xl font-bold font-mono text-rf-text">${total.toFixed(0)}</span>
                        </div>
                    ) : (
                        <span className="text-[11px] font-bold tracking-[.12em] text-rf-green-ink">LIBRE</span>
                    )}
                </div>
            </DialogTrigger>

            {/* Contenido del Modal — 80% de la pantalla */}
            <DialogContent className="w-[80vw] max-w-[80vw] sm:max-w-[80vw] max-h-[80vh] bg-rf-surface border-rf-border text-rf-text rounded-lg shadow-rf-lg flex flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-4">
                        <div className={`p-3 rounded-md ${esOcupada ? "bg-rf-red-soft text-rf-red-ink" : "bg-rf-surface-2 text-rf-text-3"}`}>
                            <UtensilsCrossed size={26} />
                        </div>
                        Mesa {id_mesa}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-6 space-y-6 flex-1 min-h-0 flex flex-col">
                    {esOcupada ? (
                        <>
                            {/* Bloque de info Orden */}
                            <div className="grid grid-cols-3 gap-4 bg-rf-surface-2 p-5 rounded-md border border-rf-border shrink-0">
                                <div>
                                    <p className="text-xs font-bold text-rf-text-3 uppercase tracking-[.12em]">ID Orden</p>
                                    <p className="font-mono text-rf-accent-ink text-xl font-bold mt-1">#{id_orden}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-bold text-rf-text-3 uppercase tracking-[.12em]">Hora</p>
                                    <p className="text-xl font-bold text-rf-text font-mono mt-1 whitespace-nowrap">{hora ?? '—'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-rf-text-3 uppercase tracking-[.12em]">Atiende</p>
                                    <p className="text-xl font-bold text-rf-text mt-1">{nombre_mesero}</p>
                                </div>
                            </div>
                            {/* Lista de Platillos (con scroll táctil) */}
                            <div className="space-y-3 flex-1 min-h-0 flex flex-col">
                                <p className="text-[13px] font-bold text-rf-text-3 uppercase tracking-[.14em] ml-1 shrink-0">Consumo Actual</p>
                                <div className="divide-y divide-rf-border border border-rf-border rounded-md overflow-hidden flex-1 overflow-y-auto custom-scrollbar">
                                    {platillos.map((p, i) => (
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
                                            {p.subtotal != null && (
                                                <span className="text-rf-text-2 text-base font-mono">${Number(p.subtotal).toFixed(0)}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Total */}
                            <div className="flex justify-between items-center px-2 shrink-0">
                                <span className="text-sm font-bold uppercase tracking-[.1em] text-rf-text-3">Total</span>
                                <span className="text-3xl font-bold font-mono text-rf-text">${total.toFixed(0)}</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 space-y-5 m-auto">
                            <div className="w-24 h-24 bg-rf-surface-2 rounded-md flex items-center justify-center mx-auto text-rf-text-3"><UtensilsCrossed size={48} /></div>
                            <p className="text-rf-text-3 font-medium text-lg">Sin actividad</p>
                        </div>
                    )}
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default MesaAdmin;
