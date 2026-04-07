// src/components/MesaAdmin.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, ReceiptText, UtensilsCrossed } from 'lucide-react';

const MesaAdmin = ({ id_mesa, estado, nombre_mesero, id_orden, platillos = [] }) => {
    const esOcupada = estado === "OCUPADA";


    return (
        <Dialog>
            <DialogTrigger asChild>
                {/* Contenedor de la Mesa: Limpio de 'hover:' 
                   - Quitamos hover:scale, hover:shadow, hover:border y opacity-60 estática.
                   - Mantenemos transition y 'active:scale-95' (feedback táctil de presión).
                */}
                <div className={`
                    cursor-pointer p-4 rounded-2xl border transition-all duration-300 h-32
                    flex flex-col justify-between active:scale-95
                    ${esOcupada
                        ? "bg-[#0f172a] border-red-500/40 shadow-lg shadow-red-900/10"
                        : "bg-[#0f172a]/40 border-slate-800/60 shadow-inner"}
                `}>

                    {/* Encabezado de Tarjeta (Fijo) */}
                    <div className="flex justify-between items-center">
                        <span className={`text-sm font-black px-2.5 py-1 rounded-lg tracking-tighter
                            ${esOcupada ? "bg-red-500/10 text-red-500" : "bg-slate-800 text-slate-400"}`}>
                            #{id_mesa}
                        </span>

                        {/* Brillo dinámico (se mantiene igual, ayuda visualmente) */}
                        <div className={`w-2.5 h-2.5 rounded-full ${esOcupada
                            ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse"
                            : "bg-slate-700"}`}
                        />
                    </div>

                    {/* Información (Fija) */}
                    <div className="flex flex-col gap-1">
                        {esOcupada ? (
                            <>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <User size={12} className="text-slate-500" />
                                    <span className="text-[11px] font-semibold truncateUppercase tracking-tight">{nombre_mesero}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 font-mono">
                                    <ReceiptText size={12} />
                                    <span className="text-[9px]">ORD: #{id_orden}</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 text-slate-600">
                                <UtensilsCrossed size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Libre</span>
                            </div>
                        )}
                    </div>
                </div>
            </DialogTrigger>

            {/* Contenido del Modal (Detalle, Dark y Táctil) */}
            <DialogContent className="sm:max-w-[400px] bg-[#0f172a] border-slate-800 text-slate-100 rounded-3xl shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${esOcupada ? "bg-red-500/10 text-red-500" : "bg-slate-800 text-slate-400"}`}>
                            <UtensilsCrossed size={20} />
                        </div>
                        Mesa {id_mesa}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-6 space-y-6">
                    {esOcupada ? (
                        <>
                            {/* Bloque de info Orden */}
                            <div className="flex justify-between items-center bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                                <div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID Orden</p><p className="font-mono text-orange-500">#{id_orden}</p></div>
                                <div className="text-right"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Atiende</p><p className="text-sm font-bold text-white">{nombre_mesero}</p></div>
                            </div>
                            {/* Lista de Platillos (con scroll táctil) */}
                            <div className="space-y-3">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Consumo Actual</p>
                                <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden max-h-[180px] overflow-y-auto custom-scrollbar">
                                    {platillos.map((p, i) => (
                                        <div key={i} className="flex justify-between items-center p-3.5 bg-slate-900/30">
                                            <div className="flex items-center gap-3"><span className="flex items-center justify-center w-6 h-6 rounded-md bg-orange-600/20 text-orange-500 text-[10px] font-black">{p.cantidad}</span><span className="text-sm font-medium text-slate-200">{p.nombre}</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10 space-y-4">
                            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto text-slate-600"><UtensilsCrossed size={32} /></div>
                            <p className="text-slate-500 font-medium italic text-sm">Sin actividad</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {esOcupada && <Button className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black py-7 rounded-2xl shadow-lg shadow-red-900/20 transition-all text-base uppercase tracking-tighter">Cerrar Cuenta y Liberar 🧾</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default MesaAdmin;