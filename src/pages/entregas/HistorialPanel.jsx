import { History } from 'lucide-react';

const HistorialPanel = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <div className="bg-slate-700/30 p-6 rounded-2xl border border-slate-700/50">
            <History size={48} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-black text-white">Historial de Entregas</h2>
        <p className="text-slate-400 max-w-sm">
            Aquí podrás consultar todas las entregas completadas del día.
        </p>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest border border-slate-700 px-3 py-1 rounded-full">
            Próximamente
        </span>
    </div>
);

export default HistorialPanel;
