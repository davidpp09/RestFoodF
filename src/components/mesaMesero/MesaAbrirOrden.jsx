import React from 'react';
import { UtensilsCrossed, ShoppingBag, Loader2 } from 'lucide-react';

const TIPOS = [
    { valor: "LOZA",        label: "Comer aquí",   Icon: UtensilsCrossed },
    { valor: "PARA_LLEVAR", label: "Para llevar",  Icon: ShoppingBag     },
];

const MesaAbrirOrden = ({ mesa, turno, onCambiarTurno, onAbrir, cargando }) => {
    const [tipo, setTipo] = React.useState("LOZA");

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

                {/* Selector de tipo */}
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tipo</p>
                    <div className="flex gap-2">
                        {TIPOS.map(({ valor, label, Icon }) => (
                            <button
                                key={valor}
                                onClick={() => setTipo(valor)}
                                className={`flex-1 flex flex-col items-center gap-2 py-3 px-4 rounded-xl border font-bold text-sm transition-all
                                    ${tipo === valor
                                        ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                                        : "border-slate-700 bg-slate-800/50 text-slate-500 hover:text-slate-300 hover:border-slate-600"}`}
                            >
                                <Icon size={20} />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Botón abrir */}
                <button
                    onClick={() => onAbrir(tipo)}
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
