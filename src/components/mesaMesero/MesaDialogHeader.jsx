import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingCart, Clock } from 'lucide-react';

const MesaDialogHeader = ({ mesa, turno, setTurno, tema }) => (
    <DialogHeader>
        <DialogTitle className="text-2xl font-black flex items-center justify-between">

            {/* Info de la mesa */}
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${tema.bgTenue} ${tema.text}`}>
                    <ShoppingCart size={24} />
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        <span>Mesa {mesa.numero}</span>
                        <span className="text-sm font-normal text-red-500">Orden #101</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-normal text-slate-500 mt-1">
                        <Clock size={12} />
                        <span>Abierta hace 32m</span>
                    </div>
                </div>
            </div>

            {/* Switch Desayuno / Comida */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
                <button
                    onClick={() => setTurno("desayuno")}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200
                        ${turno === "desayuno"
                            ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-900/30"
                            : "text-slate-500 hover:text-slate-300"}`}
                >
                    Desayuno
                </button>
                <button
                    onClick={() => setTurno("comida")}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200
                        ${turno === "comida"
                            ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-900/30"
                            : "text-slate-500 hover:text-slate-300"}`}
                >
                    Comida
                </button>
            </div>

        </DialogTitle>
    </DialogHeader>
);

export default MesaDialogHeader;
