import { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertTriangle, RefreshCw, Scale } from 'lucide-react';
import { toast } from 'sonner';
import { inventarioService } from '@/services/inventarioService';

/**
 * Teórico contra real — el reporte por el que existe todo el inventario.
 *
 * Cada renglón compara lo que el sistema cree que se consumió (ventas + merma
 * registrada) contra lo que de verdad faltó del refrigerador. La columna que
 * importa es AJUSTES: sale de los conteos físicos y es, por definición, lo que
 * nadie pudo explicar — merma no anotada, porciones más generosas, o robo.
 *
 * Se lee la TENDENCIA, no el número de una semana: 3–5% de varianza es normal,
 * las porciones varían de mano a mano. Lo que se vigila es que crezca, o que
 * un insumo se despegue del resto. Y ojo con el cero perfecto varias semanas
 * seguidas: casi siempre significa que alguien copia el teórico en vez de
 * contar de verdad.
 */

// Umbral de color: hasta 5% del consumo es lo esperado (las porciones varían
// de mano a mano — número del plan del handbook); arriba de eso, en rojo.
const colorVarianza = (pct) => (pct <= 5 ? 'text-rf-text' : 'text-rf-red');

// Primer día del mes en curso y hoy, en formato YYYY-MM-DD local (no UTC:
// toISOString() cambiaría de día pasadas las 6pm, hora de México).
const fechaLocal = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const HOY = fechaLocal(new Date());
const INICIO_MES = HOY.slice(0, 8) + '01';

const VarianzaPanel = () => {
    const [filas, setFilas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [desde, setDesde] = useState(INICIO_MES);
    const [hasta, setHasta] = useState(HOY);

    const cargar = useCallback(async () => {
        setLoading(true);
        try {
            setFilas(await inventarioService.obtenerTeoricoReal(desde, hasta));
        } catch (error) {
            toast.error(error.response?.data?.mensaje || 'Error al cargar el reporte');
        } finally {
            setLoading(false);
        }
    }, [desde, hasta]);

    useEffect(() => { cargar(); }, [cargar]);

    const negativos = filas.filter(f => f.stock_negativo);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-rf-text">Teórico contra real</h1>
                    <p className="text-rf-text-2">Lo que el sistema cree, contra lo que contó la cocina</p>
                </div>
                <div className="flex items-end gap-2">
                    {/* type="date" abre el calendario nativo de la tablet/navegador */}
                    <label className="text-sm text-rf-text-2">
                        Desde
                        <input type="date" value={desde} max={hasta}
                               onChange={e => setDesde(e.target.value)}
                               className="block h-11 px-3 rounded-md bg-rf-surface border border-rf-border text-rf-text" />
                    </label>
                    <label className="text-sm text-rf-text-2">
                        Hasta
                        <input type="date" value={hasta} min={desde} max={HOY}
                               onChange={e => setHasta(e.target.value)}
                               className="block h-11 px-3 rounded-md bg-rf-surface border border-rf-border text-rf-text" />
                    </label>
                    <button onClick={cargar}
                            className="flex items-center gap-2 px-4 h-11 rounded-md bg-rf-surface border border-rf-border
                                       text-rf-text-2 hover:text-rf-text active:scale-95 transition-all">
                        <RefreshCw size={18} /> Actualizar
                    </button>
                </div>
            </div>

            {/* Un negativo invalida la varianza de ese insumo: significa que entró
                mercancía que nadie capturó. Se avisa arriba, no renglón por renglón. */}
            {negativos.length > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-rf-red-soft border border-rf-red">
                    <AlertTriangle className="text-rf-red shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="font-semibold text-rf-red-ink">Hay compras sin capturar</p>
                        <p className="text-sm text-rf-red-ink/90">
                            {negativos.map(f => f.nombre).join(', ')} — su existencia está en negativo:
                            entró mercancía que no se registró. Mientras eso no se capture,
                            la varianza de esos insumos no significa nada.
                        </p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 text-rf-accent animate-spin mb-4" />
                    <p className="text-rf-text-2 font-medium">Calculando...</p>
                </div>
            ) : filas.length === 0 ? (
                <div className="text-center py-16 bg-rf-surface rounded-lg border border-rf-border">
                    <Scale className="mx-auto mb-3 text-rf-text-3" size={32} />
                    <p className="text-rf-text-2 font-medium">Sin movimientos en este periodo.</p>
                </div>
            ) : (
                <div className="bg-rf-surface rounded-lg border border-rf-border overflow-x-auto">
                    <table className="w-full text-sm min-w-[640px]">
                        <thead>
                            <tr className="text-left text-rf-text-3 border-b border-rf-border">
                                <th className="px-4 py-3 font-medium">Insumo</th>
                                <th className="px-3 py-3 font-medium text-right">Compró</th>
                                <th className="px-3 py-3 font-medium text-right">Vendió</th>
                                <th className="px-3 py-3 font-medium text-right">Merma</th>
                                <th className="px-3 py-3 font-medium text-right">Sin explicar</th>
                                <th className="px-3 py-3 font-medium text-right">Hay</th>
                                <th className="px-4 py-3 font-medium text-right">Varianza</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-rf-border">
                            {filas.map(f => (
                                <tr key={f.id_insumo}>
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-rf-text">{f.nombre}</p>
                                        <p className="text-xs text-rf-text-3">
                                            {f.unidad === 'PIEZA' ? 'piezas' : 'porciones'}
                                        </p>
                                    </td>
                                    <td className="px-3 py-3 text-right font-mono text-rf-text-2">{f.compras}</td>
                                    {/* Ventas y merma llegan con signo (salen del kardex);
                                        se muestran en positivo, que es como se piensan */}
                                    <td className="px-3 py-3 text-right font-mono text-rf-text-2">{Math.abs(f.consumo_ventas)}</td>
                                    <td className="px-3 py-3 text-right font-mono text-rf-text-2">{Math.abs(f.merma)}</td>
                                    <td className={`px-3 py-3 text-right font-mono font-bold ${
                                        f.ajustes === 0 ? 'text-rf-text-3' : 'text-rf-text'
                                    }`}>
                                        {f.ajustes > 0 ? `+${f.ajustes}` : f.ajustes}
                                    </td>
                                    <td className={`px-3 py-3 text-right font-mono ${
                                        f.stock_negativo ? 'text-rf-red font-bold' : 'text-rf-text-2'
                                    }`}>
                                        {f.stock}
                                    </td>
                                    <td className={`px-4 py-3 text-right font-bold ${
                                        f.stock_negativo ? 'text-rf-text-3' : colorVarianza(f.porcentaje_varianza)
                                    }`}>
                                        {f.stock_negativo ? '—' : `${f.porcentaje_varianza}%`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="text-xs text-rf-text-3 px-1">
                "Sin explicar" sale de los conteos físicos: lo que faltó (o sobró) y ningún
                movimiento justifica. Hasta 5% del consumo es normal. Un cero perfecto todas
                las semanas también es sospechoso: normalmente significa que se copió el
                teórico en vez de contar.
            </p>
        </div>
    );
};

export default VarianzaPanel;
