import { useState } from 'react';
import { Loader2, AlertTriangle, History, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useExistencias } from '@/hooks/useInventario';
import { inventarioService } from '@/services/inventarioService';

/**
 * Qué hay ahora mismo, y cómo se llegó a eso.
 *
 * El stock no sale de una columna: es la suma del kardex. Por eso cada renglón
 * se puede abrir y ver los movimientos que lo formaron — si un número se ve
 * raro, la explicación está a un toque, no en una consulta a la base.
 */

const ETIQUETA_TIPO = {
    INICIAL: 'Conteo inicial',
    COMPRA: 'Llegó mercancía',
    MERMA: 'Se echó a perder',
    VENTA: 'Vendido',
    AJUSTE: 'Ajuste por conteo',
};

const Kardex = ({ movimientos }) => {
    if (movimientos.length === 0) {
        return <p className="text-sm text-rf-text-3 p-4">Sin movimientos todavía.</p>;
    }
    return (
        <div className="divide-y divide-rf-border">
            {movimientos.map(m => (
                <div key={m.id_movimiento} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                    <span className={`font-mono font-bold w-14 text-right ${
                        m.cantidad > 0 ? 'text-rf-green' : 'text-rf-red'
                    }`}>
                        {m.cantidad > 0 ? '+' : ''}{m.cantidad}
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-rf-text font-medium">{ETIQUETA_TIPO[m.tipo] ?? m.tipo}</p>
                        {m.motivo && <p className="text-rf-text-3 truncate">{m.motivo}</p>}
                    </div>
                    <div className="text-right text-rf-text-3 shrink-0">
                        <p>{new Date(m.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}</p>
                        <p className="text-xs">{m.usuario}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ExistenciasPanel = () => {
    const { existencias, bajoMinimo, loading, recargar } = useExistencias();
    const [abierto, setAbierto] = useState(null);
    const [kardex, setKardex] = useState({});

    const alternar = async (id) => {
        if (abierto === id) { setAbierto(null); return; }
        setAbierto(id);
        if (!kardex[id]) {
            try {
                const movimientos = await inventarioService.obtenerKardex(id);
                setKardex(prev => ({ ...prev, [id]: movimientos }));
            } catch (error) {
                toast.error(error.response?.data?.mensaje || 'No se pudo cargar el historial');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-10 h-10 text-rf-accent animate-spin mb-4" />
                <p className="text-rf-text-2 font-medium">Cargando existencias...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-rf-text">Existencias</h1>
                    <p className="text-rf-text-2">Lo que hay ahora, según el kardex</p>
                </div>
                <button
                    onClick={recargar}
                    className="flex items-center gap-2 px-4 h-11 rounded-md bg-rf-surface border border-rf-border
                               text-rf-text-2 hover:text-rf-text active:scale-95 transition-all"
                >
                    <RefreshCw size={18} /> Actualizar
                </button>
            </div>

            {bajoMinimo.length > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-rf-red-soft border border-rf-red">
                    <AlertTriangle className="text-rf-red shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="font-semibold text-rf-red-ink">Hay que comprar</p>
                        <p className="text-sm text-rf-red-ink/90">
                            {bajoMinimo.map(e => e.nombre).join(', ')}
                        </p>
                    </div>
                </div>
            )}

            {existencias.length === 0 ? (
                <div className="text-center py-16 bg-rf-surface rounded-lg border border-rf-border">
                    <p className="text-rf-text-2 font-medium">Todavía no hay insumos dados de alta.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {existencias.map(item => (
                        <div key={item.id_insumos} className="bg-rf-surface rounded-lg border border-rf-border overflow-hidden">
                            <button
                                onClick={() => alternar(item.id_insumos)}
                                className="w-full flex items-center gap-4 p-4 text-left hover:bg-rf-surface-2 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-rf-text truncate">{item.nombre}</p>
                                    <p className="text-sm text-rf-text-3">
                                        mínimo {item.stock_minimo === 0 ? 'sin alerta' : item.stock_minimo}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    {/* Un stock negativo significa una compra sin capturar, no un error
                                        del sistema. Se muestra tal cual: esconderlo sería tapar la señal. */}
                                    <p className={`text-2xl font-bold ${
                                        item.stock < 0 ? 'text-rf-red'
                                            : item.bajo_minimo ? 'text-rf-red' : 'text-rf-text'
                                    }`}>
                                        {item.stock}
                                    </p>
                                    <p className="text-xs text-rf-text-3">
                                        {item.unidad === 'PIEZA' ? 'piezas' : 'porciones'}
                                    </p>
                                </div>
                                <History size={18} className="text-rf-text-3 shrink-0" />
                            </button>

                            {abierto === item.id_insumos && (
                                <div className="border-t border-rf-border bg-rf-bg">
                                    {kardex[item.id_insumos]
                                        ? <Kardex movimientos={kardex[item.id_insumos]} />
                                        : <div className="p-4 flex items-center gap-2 text-rf-text-3 text-sm">
                                              <Loader2 className="animate-spin" size={16} /> Cargando historial...
                                          </div>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExistenciasPanel;
