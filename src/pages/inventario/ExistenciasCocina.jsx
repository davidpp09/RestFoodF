import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useExistencias } from '@/hooks/useInventario';

/**
 * Lo que hay, para la cocina. Solo lectura.
 *
 * La cocina necesita saber con qué cuenta para el servicio; capturar es de
 * administración. Esta pantalla no es la de admin con los botones escondidos:
 * es una pantalla distinta, sin nada que tocar, pensada para mirarse de lejos
 * y de paso. Por eso los números son grandes y no hay historial ni detalle —
 * lo que sobra en una pantalla de consulta rápida es tan malo como lo que falta.
 *
 * El permiso real no vive aquí sino en el @PreAuthorize del backend: COCINA
 * solo puede consultar existencias. Esconder botones nunca fue un permiso.
 */
const ExistenciasCocina = () => {
    const { existencias, bajoMinimo, loading, recargar } = useExistencias();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-10 h-10 text-rf-accent animate-spin mb-4" />
                <p className="text-rf-text-2 font-medium">Cargando inventario...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-rf-text">Inventario</h1>
                    <p className="text-rf-text-2">Lo que hay según el sistema</p>
                </div>
                <button
                    onClick={recargar}
                    className="flex items-center gap-2 px-5 h-14 rounded-lg bg-rf-surface border border-rf-border
                               text-rf-text-2 active:scale-95 transition-transform"
                >
                    <RefreshCw size={20} /> Actualizar
                </button>
            </div>

            {bajoMinimo.length > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-rf-red-soft border border-rf-red">
                    <AlertTriangle className="text-rf-red shrink-0 mt-0.5" size={22} />
                    <div>
                        <p className="font-semibold text-rf-red-ink">Se está acabando</p>
                        <p className="text-sm text-rf-red-ink/90">{bajoMinimo.map(e => e.nombre).join(', ')}</p>
                    </div>
                </div>
            )}

            {existencias.length === 0 ? (
                <div className="text-center py-16 bg-rf-surface rounded-lg border border-rf-border">
                    <p className="text-rf-text-2 font-medium">Todavía no hay insumos dados de alta.</p>
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                    {existencias.map(item => (
                        <div
                            key={item.id_insumos}
                            className={`flex items-center gap-4 p-5 rounded-lg border ${
                                item.bajo_minimo || item.stock < 0
                                    ? 'bg-rf-red-soft border-rf-red'
                                    : 'bg-rf-surface border-rf-border'
                            }`}
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-rf-text text-lg leading-tight">{item.nombre}</p>
                                <p className="text-sm text-rf-text-3">
                                    {item.unidad === 'PIEZA' ? 'piezas' : 'porciones'}
                                </p>
                            </div>
                            <p className={`text-4xl font-bold tabular-nums ${
                                item.bajo_minimo || item.stock < 0 ? 'text-rf-red' : 'text-rf-text'
                            }`}>
                                {item.stock}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Sin esta nota, un número que no cuadre se lee como error del sistema
                en vez de como lo que es: algo que pasó y nadie capturó. */}
            <p className="text-xs text-rf-text-3 px-1">
                Estas cantidades son las que el sistema tiene registradas. Si no coinciden con lo que ves
                en el refrigerador, avísale al administrador.
            </p>
        </div>
    );
};

export default ExistenciasCocina;
