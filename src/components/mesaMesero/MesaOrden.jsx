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
    enviando = false,
    onCerrar,
    onCancelar,
    onReenviarCocina,
    labelEnviar,
    labelCancelar = "Cancelar Mesa",
    mostrarCerrar = true,
    tiempos,
    onCambiarCantidadTiempo,
    esDesayuno = false,
    coincideConEnviado = false,
    hayEnvioPrevio = false,
}) => {
    // La orden se abre al abrir la mesa, pero "en curso" de verdad es cuando
    // ya hay platillos enviados a cocina — por id_detalle, o porque el carrito
    // se vació después de un envío previo (hayEnvioPrevio cubre ese caso, ya
    // que el carrito vacío no tiene id_detalle que mirar)
    const yaEnviada = hayEnvioPrevio || carrito.some(item => item.id_detalle);

    return (
    <div className="flex flex-col h-full min-h-0 gap-4">

        {/* Encabezado */}
        <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${tema.bgTenue} flex items-center justify-center`}>
                <Utensils size={16} className={tema.text} />
            </div>
            <div>
                <p className="text-xs font-bold text-rf-text-3 uppercase tracking-widest">ORDEN ACTUAL</p>
                <p className="text-base font-bold text-rf-text">
                    {yaEnviada ? "Orden en curso" : "Nueva orden"}
                </p>
            </div>
        </div>

        {/* Lista de items */}
        <div className="space-y-2 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            {carrito.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-rf-text-3 py-8">
                    <Utensils size={28} className="mb-2 opacity-30" />
                    <p className="text-sm">Agrega productos del menú</p>
                </div>
            ) : (
                carrito.map((item) => (
                    <div key={item.id} className="p-3 bg-rf-surface border border-rf-border rounded-md">

                        {/* Nombre + eliminar */}
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0 mr-2">
                                <p className="text-base font-bold text-rf-text line-clamp-1">{item.nombre}</p>
                                <p className="text-sm text-rf-text-3 font-mono">${Number(item.precio ?? 0).toFixed(0)}</p>
                            </div>
                            <button
                                onClick={() => onEliminar(item.id)}
                                className="w-10 h-10 rounded-lg bg-rf-red-soft hover:bg-rf-red-soft/80 active:bg-rf-red-soft/60 flex items-center justify-center transition-colors flex-shrink-0"
                            >
                                <Trash2 size={16} className="text-rf-red-ink" />
                            </button>
                        </div>

                        {/* Cantidad + subtotal */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onCambiarCantidad(item.id, -1)}
                                    className="w-11 h-11 rounded-md bg-rf-surface-2 hover:bg-rf-border active:scale-95 flex items-center justify-center transition-all"
                                >
                                    <Minus size={18} className="text-rf-text-2" />
                                </button>
                                <span className="w-10 text-center text-lg font-bold font-mono text-rf-text">{item.cantidad}</span>
                                <button
                                    onClick={() => onCambiarCantidad(item.id, +1)}
                                    className="w-11 h-11 rounded-md bg-rf-surface-2 hover:bg-rf-border active:scale-95 flex items-center justify-center transition-all"
                                >
                                    <Plus size={18} className="text-rf-text-2" />
                                </button>
                            </div>
                            <p className="text-lg font-bold font-mono text-rf-text">${(Number(item.precio ?? 0) * item.cantidad).toFixed(0)}</p>
                        </div>

                        {/* Comentarios */}
                        <div className="flex items-center gap-2">
                            <MessageSquare size={14} className="text-rf-text-3 flex-shrink-0" />
                            <input
                                type="text"
                                value={item.comentarios}
                                onChange={(e) => onCambiarComentario(item.id, e.target.value)}
                                placeholder="Comentarios..."
                                className="w-full text-sm bg-rf-surface border border-rf-border rounded-md px-3 py-2.5 text-rf-text placeholder:text-rf-text-3 outline-none focus:border-rf-turno transition-colors"
                            />
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Tiempos (comida) / bebida (desayuno) */}
        {tiempos && (
            <TiemposSection
                tiempos={tiempos}
                onCambiarCantidad={onCambiarCantidadTiempo}
                esDesayuno={esDesayuno}
            />
        )}

        {/* Total */}
        <div className="pt-3 border-t border-rf-border">
            <div className="flex justify-between items-center">
                <span className="text-base font-bold text-rf-text">Total</span>
                <span className={`text-xl font-bold ${tema.text}`}>${total.toFixed(0)}</span>
            </div>
        </div>

        {/* Botones — en vertical los secundarios comparten fila SOLO cuando de
            verdad se renderizan ambos; si no, cada uno ocupa la fila completa */}
        {(() => {
            const muestraReenviar = tieneOrden && !!onReenviarCocina && yaEnviada;
            const muestraCancelar = !!onCancelar && carrito.length === 0 && tieneOrden;
            const muestraCerrar   = mostrarCerrar && carrito.length > 0 && coincideConEnviado;
            const dosSecundarios  = muestraReenviar && (muestraCancelar || muestraCerrar);
            const anchoSecundario = dosSecundarios ? "" : "portrait:col-span-2";
            return (
        <div className="grid grid-cols-1 portrait:grid-cols-2 gap-2.5">
            <button
                onClick={onActualizar}
                disabled={enviando || (hayEnvioPrevio ? coincideConEnviado : carrito.length === 0)}
                className={`w-full portrait:col-span-2 px-4 py-4 rounded-md ${tema.bg} ${tema.bgHover} active:scale-[0.98] text-white font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed`}
            >
                {enviando ? "Enviando..." : (labelEnviar ?? (yaEnviada ? "Modificar Orden" : "Enviar Orden"))}
            </button>
            {/* Cerrar y Cobrar SOLO cuando el carrito coincide con lo enviado a
                cocina — con cambios sin enviar se cobraría distinto a lo servido */}
            {muestraCancelar && (
                <button
                    onClick={onCancelar}
                    className={`w-full ${anchoSecundario} px-4 py-4 rounded-md border border-rf-red hover:bg-rf-red-soft active:bg-rf-red-soft text-rf-red-ink font-bold text-base portrait:text-sm transition-colors flex items-center justify-center gap-2`}
                >
                    <Ban size={16} />
                    {labelCancelar}
                </button>
            )}
            {muestraCerrar && (
                <button
                    onClick={onCerrar}
                    className={`w-full ${anchoSecundario} px-4 py-4 rounded-md border border-rf-green hover:bg-rf-green-soft active:bg-rf-green-soft text-rf-green-ink font-bold text-base portrait:text-sm transition-colors`}
                >
                    Cerrar y Cobrar
                </button>
            )}
            {muestraReenviar && (
                <button
                    onClick={onReenviarCocina}
                    className={`w-full ${dosSecundarios ? "" : "portrait:col-span-2"} px-4 py-3.5 rounded-md border border-rf-border-strong hover:bg-rf-surface-2 active:bg-rf-surface-2 text-rf-text-2 hover:text-rf-text font-bold text-sm transition-colors flex items-center justify-center gap-2`}
                >
                    <RefreshCw size={16} />
                    Reenviar a Cocina
                </button>
            )}
        </div>
            );
        })()}
    </div>
    );
};

export default MesaOrden;
