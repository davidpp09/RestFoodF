import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

const MesaOrden = ({ carrito, subtotal, iva, total }) => (
    <div className="space-y-4 flex flex-col">

        {/* Encabezado de la orden */}
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <ShoppingCart size={16} className="text-cyan-500" />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">ORDEN ACTUAL</p>
                <p className="text-base font-black text-slate-200">
                    Comanda <span className="text-slate-500">#101</span>
                </p>
            </div>
        </div>

        {/* Lista de items */}
        <div className="space-y-2 flex-1 overflow-y-auto pr-2">
            {carrito.map((item) => (
                <div key={item.id} className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-200 line-clamp-1">{item.nombre}</p>
                            <p className="text-xs text-slate-500 font-mono">${item.precio.toFixed(2)}</p>
                        </div>
                        <button className="w-6 h-6 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                            <Trash2 size={12} className="text-red-500" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <button className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                                <Minus size={12} className="text-slate-400" />
                            </button>
                            <span className="w-8 text-center font-black text-white">{item.cantidad}</span>
                            <button className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                                <Plus size={12} className="text-slate-400" />
                            </button>
                        </div>
                        <p className="text-base font-black text-white">${(item.precio * item.cantidad).toFixed(2)}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* Totales */}
        <div className="space-y-2 pt-3 border-t border-slate-800">
            <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-mono text-slate-300">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-slate-500">IVA (16%)</span>
                <span className="font-mono text-slate-300">${iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-base font-bold text-slate-200">Total</span>
                <span className="text-xl font-black text-cyan-500">${total.toFixed(2)}</span>
            </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-2">
            <button className="w-full px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-sm transition-colors">
                Actualizar Orden
            </button>
            <button className="w-full px-4 py-3 rounded-xl border-2 border-green-500/30 hover:bg-green-500/10 text-green-500 font-bold text-sm transition-colors">
                Cerrar y Cobrar
            </button>
        </div>
    </div>
);

export default MesaOrden;
