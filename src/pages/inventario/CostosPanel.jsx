import { useState, useEffect, useCallback } from 'react';
import { Loader2, RefreshCw, DollarSign, Info } from 'lucide-react';
import { toast } from 'sonner';
import { inventarioService } from '@/services/inventarioService';

/**
 * Food cost (Fase 3): qué porcentaje del precio de cada platillo se va en
 * materia prima vigilada. Aquí se descubre qué platillos dejan dinero.
 *
 * El costo es un PISO, no el costo completo: solo suma los insumos del kardex.
 * La tortilla, la salsa y el gas no están vigilados y no aparecen. Sirve para
 * comparar platillos entre sí y ver tendencias — no para calcular el margen
 * exacto de nada.
 */

// En el gremio, 30–35% de food cost es lo sano. Como aquí el costo es un piso,
// pasarse de 35% con solo los insumos vigilados es doblemente grave.
const colorPct = (pct) =>
    pct <= 35 ? 'text-rf-text' : 'text-rf-red';

const CostosPanel = () => {
    const [filas, setFilas] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargar = useCallback(async () => {
        setLoading(true);
        try {
            setFilas(await inventarioService.obtenerFoodCost());
        } catch (error) {
            toast.error(error.response?.data?.mensaje || 'Error al cargar los costos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    const incompletos = filas.filter(f => f.costo_incompleto).length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-rf-text">Costos por platillo</h1>
                    <p className="text-rf-text-2">Cuánto del precio se va en insumos vigilados</p>
                </div>
                <button onClick={cargar}
                        className="flex items-center gap-2 px-4 h-11 rounded-md bg-rf-surface border border-rf-border
                                   text-rf-text-2 hover:text-rf-text active:scale-95 transition-all">
                    <RefreshCw size={18} /> Actualizar
                </button>
            </div>

            {incompletos > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-rf-surface border border-rf-border">
                    <Info className="text-rf-text-3 shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-rf-text-2">
                        {incompletos} platillo(s) marcados con * tienen insumos que aún no registran
                        ninguna compra con costo: su número es más bajo que la realidad. Se completa
                        solo, con la primera compra capturada con precio.
                    </p>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 text-rf-accent animate-spin mb-4" />
                    <p className="text-rf-text-2 font-medium">Calculando...</p>
                </div>
            ) : filas.length === 0 ? (
                <div className="text-center py-16 bg-rf-surface rounded-lg border border-rf-border">
                    <DollarSign className="mx-auto mb-3 text-rf-text-3" size={32} />
                    <p className="text-rf-text-2 font-medium">Sin datos todavía.</p>
                    <p className="text-rf-text-3 text-sm mt-1">
                        El costo aparece cuando las compras se capturan con su precio.
                    </p>
                </div>
            ) : (
                <div className="bg-rf-surface rounded-lg border border-rf-border overflow-x-auto">
                    <table className="w-full text-sm min-w-[560px]">
                        <thead>
                            <tr className="text-left text-rf-text-3 border-b border-rf-border">
                                <th className="px-4 py-3 font-medium">Platillo</th>
                                <th className="px-3 py-3 font-medium text-right">Insumos ($)</th>
                                <th className="px-3 py-3 font-medium text-right">Precio comida</th>
                                <th className="px-4 py-3 font-medium text-right">Food cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-rf-border">
                            {filas.map(f => (
                                <tr key={f.id_producto}>
                                    <td className="px-4 py-3 font-semibold text-rf-text">
                                        {f.producto}{f.costo_incompleto && ' *'}
                                    </td>
                                    <td className="px-3 py-3 text-right font-mono text-rf-text-2">
                                        ${f.costo_insumos}
                                    </td>
                                    <td className="px-3 py-3 text-right font-mono text-rf-text-2">
                                        {/* Hay platillos sin precio de comida (solo desayuno); sin esto saldría "$null" */}
                                        {f.precio_comida != null ? `$${f.precio_comida}` : '—'}
                                    </td>
                                    <td className={`px-4 py-3 text-right font-bold ${colorPct(f.food_cost_pct)}`}>
                                        {f.food_cost_pct}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="text-xs text-rf-text-3 px-1">
                El costo solo cuenta insumos vigilados (control selectivo): es un piso, no el
                costo completo del platillo. Hasta 35% se considera sano; arriba, en rojo —
                y como aquí falta la parte no vigilada, un rojo aquí es rojo de verdad.
            </p>
        </div>
    );
};

export default CostosPanel;
