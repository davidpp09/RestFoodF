import { Utensils, Plus, Minus, Trash2, MessageSquare, RefreshCw, Ban } from 'lucide-react';
import TiemposSection from './TiemposSection';

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
    onCancelar,
    onReenviarCocina,
    labelEnviar,
    mostrarCerrar = true,
    tiempos,
    onCambiarCantidadTiempo,
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
        <div className="space-y-2 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
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
                                <p className="text-base font-bold text-slate-200 line-clamp-1">{item.nombre}</p>
                                <p className="text-sm text-slate-500 font-mono">${Number(item.precio ?? 0).toFixed(2)}</p>
                            </div>
                            <button
                                onClick={() => onEliminar(item.id)}
                                className="w-10 h-10 rounded-lg bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 flex items-center justify-center transition-colors flex-shrink-0"
                            >
                                <Trash2 size={16} className="text-red-500" />
                            </button>
                        </div>

                        {/* Cantidad + subtotal */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onCambiarCantidad(item.id, -1)}
                                    className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 flex items-center justify-center transition-all"
                                >
                                    <Minus size={18} className="text-slate-300" />
                                </button>
                                <span className="w-10 text-center text-lg font-black text-white">{item.cantidad}</span>
                                <button
                                    onClick={() => onCambiarCantidad(item.id, +1)}
                                    className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 flex items-center justify-center transition-all"
                                >
                                    <Plus size={18} className="text-slate-300" />
                                </button>
                            </div>
                            <p className="text-lg font-black text-white">${(Number(item.precio ?? 0) * item.cantidad).toFixed(2)}</p>
                        </div>

                        {/* Comentarios */}
                        <div className="flex items-center gap-2">
                            <MessageSquare size={14} className="text-slate-600 flex-shrink-0" />
                            <input
                                type="text"
                                value={item.comentarios}
                                onChange={(e) => onCambiarComentario(item.id, e.target.value)}
                                placeholder="Comentarios..."
                                className="w-full text-sm bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-slate-300 placeholder:text-slate-600 outline-none focus:border-slate-500 transition-colors"
                            />
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Tiempos — solo mesero */}
        {tiempos && (
            <TiemposSection
                tiempos={tiempos}
                onCambiarCantidad={onCambiarCantidadTiempo}
            />
        )}

        {/* Total */}
        <div className="pt-3 border-t border-slate-800">
            <div className="flex justify-between items-center">
                <span className="text-base font-bold text-slate-200">Total</span>
                <span className={`text-xl font-black ${tema.text}`}>${total.toFixed(2)}</span>
            </div>
        </div>

        {/* Botones — en vertical los secundarios comparten fila para ahorrar altura */}
        <div className="grid grid-cols-1 portrait:grid-cols-2 gap-2.5">
            <button
                onClick={onActualizar}
                disabled={carrito.length === 0}
                className={`w-full portrait:col-span-2 px-4 py-4 rounded-xl ${tema.bg} ${tema.bgHover} active:scale-[0.98] text-slate-950 font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed`}
            >
                {labelEnviar ?? (tieneOrden ? "Modificar Orden" : "Enviar Orden")}
            </button>
            {mostrarCerrar && (carrito.length === 0 ? (
                tieneOrden && (
                    <button
                        onClick={onCancelar}
                        className={`w-full ${!(tieneOrden && onReenviarCocina) ? "portrait:col-span-2" : ""} px-4 py-4 rounded-xl border-2 border-red-500/30 hover:bg-red-500/10 active:bg-red-500/20 text-red-500 font-bold text-base portrait:text-sm transition-colors flex items-center justify-center gap-2`}
                    >
                        <Ban size={16} />
                        Cancelar Mesa
                    </button>
                )
            ) : (
                <button
                    onClick={onCerrar}
                    className={`w-full ${!(tieneOrden && onReenviarCocina) ? "portrait:col-span-2" : ""} px-4 py-4 rounded-xl border-2 border-green-500/30 hover:bg-green-500/10 active:bg-green-500/20 text-green-500 font-bold text-base portrait:text-sm transition-colors`}
                >
                    Cerrar y Cobrar
                </button>
            ))}
            {tieneOrden && onReenviarCocina && (
                <button
                    onClick={onReenviarCocina}
                    className={`w-full ${!mostrarCerrar ? "portrait:col-span-2" : ""} px-4 py-3.5 rounded-xl border border-slate-700 hover:bg-slate-800 active:bg-slate-700 text-slate-400 hover:text-slate-200 font-bold text-sm transition-colors flex items-center justify-center gap-2`}
                >
                    <RefreshCw size={16} />
                    Reenviar a Cocina
                </button>
            )}
        </div>
    </div>
);

export default MesaOrden;
