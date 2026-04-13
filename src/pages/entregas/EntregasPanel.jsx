import { Package } from 'lucide-react';

const EntregasPanel = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <div className="bg-orange-500/10 p-6 rounded-2xl border border-orange-500/20">
            <Package size={48} className="text-orange-500" />
        </div>
        <h2 className="text-2xl font-black text-white">Entregas Pendientes</h2>
        <p className="text-slate-400 max-w-sm">
            Aquí aparecerán los pedidos para llevar asignados a este repartidor.
        </p>
        <span className="text-xs font-bold text-orange-500/60 uppercase tracking-widest border border-orange-500/20 px-3 py-1 rounded-full">
            Próximamente
        </span>
    </div>
);

export default EntregasPanel;
