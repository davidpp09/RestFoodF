import React from 'react';
import { Loader2 } from 'lucide-react';

const MesaAbrirOrden = ({ mesa, turno, onCambiarTurno, onAbrir, cargando }) => {
    return (
        /* Overlay centrado sobre el fondo difuminado */
        <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-sm shadow-2xl flex flex-col gap-6">

                {/* Título */}
                <div className="text-center">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Mesa</p>
                    <p className="text-4xl font-black text-white">#{mesa.numero}</p>
                </div>

                {/* Selector de turno */}
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Turno</p>
                    <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1 gap-1">
                        <button
                            onClick={() => onCambiarTurno("desayuno")}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200
                                ${turno === "desayuno"
                                    ? "bg-amber-500 text-slate-950 shadow-md"
                                    : "text-slate-500 hover:text-slate-300"}`}
                        >
                            Desayuno
                        </button>
                        <button
                            onClick={() => onCambiarTurno("comida")}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200
                                ${turno === "comida"
                                    ? "bg-cyan-500 text-slate-950 shadow-md"
                                    : "text-slate-500 hover:text-slate-300"}`}
                        >
                            Comida
                        </button>
                    </div>
                </div>

                {/* Botón abrir */}
                <button
                    onClick={() => onAbrir("LOZA")}
                    disabled={cargando}
                    className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {cargando
                        ? <><Loader2 size={16} className="animate-spin" /> Abriendo...</>
                        : "Abrir Orden"
                    }
                </button>
            </div>
        </div>
    );
};

export default MesaAbrirOrden;
