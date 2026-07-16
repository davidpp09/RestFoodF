import React from 'react';
import { Loader2 } from 'lucide-react';

const MesaAbrirOrden = ({ mesa, turno, onCambiarTurno, onAbrir, cargando }) => {
    return (
        /* Overlay centrado sobre el fondo difuminado.
           pointer-events-none en el wrapper: solo la tarjeta captura taps,
           para no tapar el botón X de cerrar el dialog */
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="pointer-events-auto bg-rf-surface border border-rf-border rounded-lg p-8 w-full max-w-sm shadow-2xl flex flex-col gap-6">

                {/* Título */}
                <div className="text-center">
                    <p className="text-xs font-bold text-rf-text-3 uppercase tracking-widest mb-1">Mesa</p>
                    <p className="text-4xl font-bold font-mono text-rf-text">#{mesa.numero}</p>
                </div>

                {/* Selector de turno */}
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold text-rf-text-3 uppercase tracking-widest">Turno</p>
                    <div className="flex items-center bg-rf-surface-2 border border-rf-border rounded-md p-1 gap-1">
                        <button
                            onClick={() => onCambiarTurno("desayuno")}
                            className={`flex-1 py-3 rounded-lg text-base font-bold transition-all duration-200 active:scale-95
                                ${turno === "desayuno"
                                    ? "bg-rf-accent text-white"
                                    : "text-rf-text-3 hover:text-rf-text-2"}`}
                        >
                            Desayuno
                        </button>
                        <button
                            onClick={() => onCambiarTurno("comida")}
                            className={`flex-1 py-3 rounded-lg text-base font-bold transition-all duration-200 active:scale-95
                                ${turno === "comida"
                                    ? "bg-rf-cyan text-white"
                                    : "text-rf-text-3 hover:text-rf-text-2"}`}
                        >
                            Comida
                        </button>
                    </div>
                </div>

                {/* Botón abrir */}
                <button
                    onClick={() => onAbrir("LOZA")}
                    disabled={cargando}
                    className="w-full py-3.5 rounded-md bg-rf-turno hover:bg-rf-turno-strong text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
