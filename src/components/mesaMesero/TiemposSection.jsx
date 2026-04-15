import { Minus, Plus } from 'lucide-react';

const Contador = ({ label, cantidad, onCambiar }) => (
    <div className="flex items-center gap-1 flex-1">
        <span className="text-[11px] font-semibold text-slate-400 flex-1 truncate">{label}</span>
        <button
            onClick={() => onCambiar(-1)}
            className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors shrink-0"
        >
            <Minus size={9} className="text-slate-300" />
        </button>
        <span className="w-4 text-center text-xs font-black text-white shrink-0">
            {Number(cantidad) || 0}
        </span>
        <button
            onClick={() => onCambiar(+1)}
            className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors shrink-0"
        >
            <Plus size={9} className="text-slate-300" />
        </button>
    </div>
);

const TiemposSection = ({ tiempos, onCambiarCantidad }) => (
    <div className="border border-slate-700/60 rounded-lg px-2.5 py-2 bg-slate-900/60 shrink-0 space-y-1.5">
        {/* Tiempo 1 */}
        <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest w-6 shrink-0">1er</span>
            <div className="flex gap-2 flex-1">
                <Contador
                    label="Consomé"
                    cantidad={tiempos.tiempo1.consome}
                    onCambiar={(d) => onCambiarCantidad('tiempo1', 'consome', d)}
                />
                <Contador
                    label="Sopa/Crema"
                    cantidad={tiempos.tiempo1.sopa_crema}
                    onCambiar={(d) => onCambiarCantidad('tiempo1', 'sopa_crema', d)}
                />
            </div>
        </div>

        {/* Tiempo 2 */}
        <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest w-6 shrink-0">2do</span>
            <div className="flex gap-2 flex-1">
                <Contador
                    label="Arroz"
                    cantidad={tiempos.tiempo2.arroz}
                    onCambiar={(d) => onCambiarCantidad('tiempo2', 'arroz', d)}
                />
                <Contador
                    label="Espaguetti"
                    cantidad={tiempos.tiempo2.espaguetti}
                    onCambiar={(d) => onCambiarCantidad('tiempo2', 'espaguetti', d)}
                />
            </div>
        </div>
    </div>
);

export default TiemposSection;
