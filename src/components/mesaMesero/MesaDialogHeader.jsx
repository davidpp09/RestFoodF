import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingCart, Clock } from 'lucide-react';

const MesaDialogHeader = ({ mesa, tema, numeroComanda }) => (
    <DialogHeader>
        <DialogTitle className="text-2xl font-black flex items-center gap-3">
            <div className={`p-2 rounded-lg ${tema.bgTenue} ${tema.text}`}>
                <ShoppingCart size={24} />
            </div>
            <div>
                <div className="flex items-center gap-3">
                    <span>Mesa {mesa.numero}</span>
                    {numeroComanda != null && (
                        <span className="text-sm font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg">
                            Comanda #{numeroComanda}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 text-xs font-normal text-slate-500 mt-1">
                    <Clock size={12} />
                    <span>Orden en curso</span>
                </div>
            </div>
        </DialogTitle>
    </DialogHeader>
);

export default MesaDialogHeader;
