import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

const MesaMesero = ({ mesa }) => {
    const esOcupada = mesa.estado === "OCUPADA";

    return (
        <div className={`
            cursor-pointer p-4 rounded-2xl border transition-all duration-300 h-32
            flex flex-col justify-between active:scale-95
            ${esOcupada
                ? "bg-[#0f172a] border-red-500/40 shadow-lg shadow-red-900/10"
                : "bg-[#0f172a]/40 border-slate-800/60 shadow-inner"}
        `}>
            {/* Encabezado */}
            <div className="flex justify-between items-center">
                <span className={`text-sm font-black px-2.5 py-1 rounded-lg tracking-tighter
                    ${esOcupada ? "bg-red-500/10 text-red-500" : "bg-slate-800 text-slate-400"}`}>
                    #{mesa.numero}
                </span>

                {/* Indicador de estado */}
                <div className={`w-2.5 h-2.5 rounded-full ${esOcupada
                    ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse"
                    : "bg-slate-700"}`}
                />
            </div>

            {/* Información */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-600">
                    <UtensilsCrossed size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                        {esOcupada ? "Ocupada" : "Libre"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MesaMesero;