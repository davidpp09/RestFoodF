import { Utensils, Plus, Minus, Trash2, MessageSquare } from 'lucide-react';

const MesaOrden = ({
    carrito,
    total,
    tema,
    tieneOrden,
    onCambiarCantidad,
    onEliminar,
    onCambiarComentario,
    onActualizar,
    onCerrar,
    labelEnviar,
    mostrarCerrar = true,
}) => (
    <div className="flex flex-col h-full min-h-0 gap-4">

        {/* Encabezado */}
        <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${tema.bgTenue} flex items-center justify-center`}>
                <Utensils size={16} className={tema.text} />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">ORDEN ACTUAL</p>
                <p className="text-base font-black text-slate-200">
                    {tieneOrden ? "Orden en curso" : "Nueva orden"}
                </p>
            </div>
        </div>

        {/* Lista de items */}
        <div className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-2">
            {carrito.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 py-8">
                    <Utensils size={28} className="mb-2 opacity-30" />
                    <p className="text-sm">Agrega productos del menú</p>
                </div>
            ) : (
                carrito.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">

                        {/* Nombre + eliminar */}
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0 mr-2">
                                <p className="text-sm font-bold text-slate-200 line-clamp-1">{item.nombre}</p>
                                <p className="text-xs text-slate-500 font-mono">${item.precio.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={() => onEliminar(item.id)}
                                className="w-6 h-6 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors flex-shrink-0"
                            >
                                <Trash2 size={12} className="text-red-500" />
                            </button>
                        </div>

                        {/* Cantidad + subtotal */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => onCambiarCantidad(item.id, -1)}
                                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                                >
                                    <Minus size={12} className="text-slate-400" />
                                </button>
                                <span className="w-8 text-center font-black text-white">{item.cantidad}</span>
                                <button
                                    onClick={() => onCambiarCantidad(item.id, +1)}
                                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                                >
                                    <Plus size={12} className="text-slate-400" />
                                </button>
                            </div>
                            <p className="text-base font-black text-white">${(item.precio * item.cantidad).toFixed(2)}</p>
                        </div>

                        {/* Comentarios */}
                        <div className="flex items-center gap-1.5">
                            <MessageSquare size={11} className="text-slate-600 flex-shrink-0" />
                            <input
                                type="text"
                                value={item.comentarios}
                                onChange={(e) => onCambiarComentario(item.id, e.target.value)}
                                placeholder="Comentarios..."
                                className="w-full text-xs bg-slate-800/50 border border-slate-700/50 rounded-lg px-2 py-1.5 text-slate-300 placeholder:text-slate-600 outline-none focus:border-slate-500 transition-colors"
                            />
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Total */}
        <div className="pt-3 border-t border-slate-800">
            <div className="flex justify-between items-center">
                <span className="text-base font-bold text-slate-200">Total</span>
                <span className={`text-xl font-black ${tema.text}`}>${total.toFixed(2)}</span>
            </div>
        </div>

        {/* Botones */}
        <div className="space-y-2">
            <button
                onClick={onActualizar}
                disabled={carrito.length === 0}
                className={`w-full px-4 py-3 rounded-xl ${tema.bg} ${tema.bgHover} text-slate-950 font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
            >
                {labelEnviar ?? (tieneOrden ? "Modificar Orden" : "Enviar Orden")}
            </button>
            {mostrarCerrar && (
                <button
                    onClick={onCerrar}
                    className="w-full px-4 py-3 rounded-xl border-2 border-green-500/30 hover:bg-green-500/10 text-green-500 font-bold text-sm transition-colors"
                >
                    Cerrar y Cobrar
                </button>
            )}
        </div>
    </div>
);

export default MesaOrden;
