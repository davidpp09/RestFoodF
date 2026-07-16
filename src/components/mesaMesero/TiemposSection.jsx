import { Minus, Plus } from 'lucide-react';
import { resumenDeTiempos } from '../../hooks/useTiempos';

const Contador = ({ label, cantidad, onCambiar }) => (
    <div className="flex items-center gap-1.5 flex-1">
        <span className="text-xs font-semibold text-rf-text-2 flex-1 truncate">{label}</span>
        <button
            onClick={() => onCambiar(-1)}
            className="w-8 h-8 rounded-lg bg-rf-surface-2 hover:bg-rf-border active:scale-95 flex items-center justify-center transition-all shrink-0"
        >
            <Minus size={13} className="text-rf-text-2" />
        </button>
        <span className="w-5 text-center text-sm font-bold font-mono text-rf-text shrink-0">
            {Number(cantidad) || 0}
        </span>
        <button
            onClick={() => onCambiar(+1)}
            className="w-8 h-8 rounded-lg bg-rf-surface-2 hover:bg-rf-border active:scale-95 flex items-center justify-center transition-all shrink-0"
        >
            <Plus size={13} className="text-rf-text-2" />
        </button>
    </div>
);

const TiemposSection = ({ tiempos, onCambiarCantidad }) => {
    // Resumen legible de lo marcado — al reabrir la orden se ve de un vistazo
    // qué tiempos se pidieron, sin buscar los números en los contadores
    const resumen = resumenDeTiempos(tiempos);

    return (
    <div className="border border-rf-border rounded-md px-2.5 py-2 bg-rf-surface shrink-0 space-y-1.5">
        {/* Encabezado con el resumen de tiempos pedidos */}
        <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-bold text-rf-text-3 uppercase tracking-widest shrink-0">Tiempos</span>
            {resumen && (
                <span className="text-xs font-bold text-rf-turno-ink truncate">{resumen}</span>
            )}
        </div>

        {/* Tiempo 1 */}
        <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-rf-text-3 uppercase tracking-widest w-6 shrink-0">1er</span>
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
            <span className="text-[9px] font-bold text-rf-text-3 uppercase tracking-widest w-6 shrink-0">2do</span>
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
};

export default TiemposSection;
