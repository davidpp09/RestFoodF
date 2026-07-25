import { useState } from 'react';
import { Loader2, PackagePlus, Trash2, ClipboardCheck, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useExistencias } from '@/hooks/useInventario';
import { inventarioService } from '@/services/inventarioService';

/**
 * Captura de inventario en la tablet de cocina.
 *
 * La usa alguien con las manos ocupadas y prisa. Todo el diseño sale de ahí:
 * una sola pantalla con tres modos en vez de tres pantallas, botones grandes
 * de más y menos en vez de teclado, y un solo botón de guardar al final. Si
 * capturar tomara más de un minuto, en dos semanas nadie lo haría — y el
 * inventario se muere por eso, no por el código.
 */

const MODOS = {
    COMPRA: {
        etiqueta: 'Llegó mercancía',
        icono: PackagePlus,
        ayuda: 'Cuenta lo que llegó y anótalo. Solo los que tengan cantidad se guardan.',
        color: 'text-rf-green',
    },
    MERMA: {
        etiqueta: 'Se echó a perder',
        icono: Trash2,
        ayuda: 'Lo que se tiró o se canceló ya cocinado. Anota el motivo.',
        color: 'text-rf-red',
    },
    CONTEO: {
        etiqueta: 'Conteo físico',
        icono: ClipboardCheck,
        ayuda: 'Cuenta TODO lo que hay y anótalo, aunque sea cero. El sistema ajusta la diferencia.',
        color: 'text-rf-blue',
    },
};

/** Un renglón: nombre grande y dos botones que se puedan picar sin apuntar. */
const RenglonInsumo = ({ item, valor, onCambiar, modo }) => (
    <div className="flex items-center gap-3 p-4 bg-rf-surface rounded-lg border border-rf-border">
        <div className="flex-1 min-w-0">
            <p className="font-semibold text-rf-text text-lg truncate">{item.nombre}</p>
            <p className="text-sm text-rf-text-3">
                {item.unidad === 'PIEZA' ? 'piezas' : 'porciones'}
                {modo === 'CONTEO' && <span className="ml-2">· el sistema dice {item.stock}</span>}
            </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
            <button
                type="button"
                onClick={() => onCambiar(Math.max(0, valor - 1))}
                className="size-14 rounded-lg bg-rf-surface-2 border border-rf-border text-rf-text
                           text-3xl font-bold active:scale-95 transition-transform disabled:opacity-40"
                disabled={valor <= 0}
                aria-label={`Quitar uno de ${item.nombre}`}
            >
                −
            </button>

            {/* Editable a mano: contar 60 pechugas a golpe de botón sería una tortura. */}
            <input
                type="number"
                inputMode="numeric"
                min="0"
                value={valor === 0 ? '' : valor}
                placeholder="0"
                onChange={(e) => onCambiar(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-20 h-14 text-center text-2xl font-bold rounded-lg bg-rf-bg
                           border border-rf-border text-rf-text focus:outline-none focus:border-rf-accent"
                aria-label={`Cantidad de ${item.nombre}`}
            />

            <button
                type="button"
                onClick={() => onCambiar(valor + 1)}
                className="size-14 rounded-lg bg-rf-accent-soft border border-rf-accent-border
                           text-rf-accent-ink text-3xl font-bold active:scale-95 transition-transform"
                aria-label={`Agregar uno a ${item.nombre}`}
            >
                +
            </button>
        </div>
    </div>
);

const CapturaPanel = () => {
    const { existencias, loading, recargar } = useExistencias();
    const [modo, setModo] = useState('COMPRA');
    const [cantidades, setCantidades] = useState({});
    const [motivo, setMotivo] = useState('');
    const [guardando, setGuardando] = useState(false);

    const cambiarModo = (nuevo) => {
        setModo(nuevo);
        setCantidades({});
        setMotivo('');
    };

    const fijar = (id, valor) => setCantidades(prev => ({ ...prev, [id]: valor }));

    // En COMPRA y MERMA solo cuentan los que tienen cantidad. En CONTEO cuenta
    // todo, incluso los ceros: "no hay nada" es un dato, no una omisión.
    const conCantidad = existencias.filter(e => (cantidades[e.id_insumos] ?? 0) > 0);
    const listoParaGuardar = modo === 'CONTEO'
        ? existencias.length > 0
        : conCantidad.length > 0 && (modo !== 'MERMA' || motivo.trim().length > 0);

    const guardar = async () => {
        setGuardando(true);
        try {
            if (modo === 'CONTEO') {
                const lineas = existencias.map(e => ({
                    id_insumo: e.id_insumos,
                    cantidad_contada: cantidades[e.id_insumos] ?? 0,
                }));
                const conteo = await inventarioService.registrarConteo({ notas: motivo || null, lineas });
                const descuadres = conteo.lineas.filter(l => l.varianza !== 0);
                toast.success(
                    descuadres.length === 0
                        ? 'Conteo guardado. Todo cuadró.'
                        : `Conteo guardado. ${descuadres.length} insumo(s) no cuadraron y se ajustaron.`
                );
            } else {
                // Uno por uno a propósito: si falla el tercero, los dos primeros
                // ya quedaron registrados y no se pierde el trabajo de capturar.
                for (const item of conCantidad) {
                    await inventarioService.registrarMovimiento({
                        id_insumo: item.id_insumos,
                        tipo: modo,
                        cantidad: cantidades[item.id_insumos],
                        motivo: motivo.trim() || null,
                    });
                }
                toast.success(`Guardado: ${conCantidad.length} insumo(s).`);
            }
            setCantidades({});
            setMotivo('');
            recargar();
        } catch (error) {
            toast.error(error.response?.data?.mensaje || 'No se pudo guardar');
        } finally {
            setGuardando(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-10 h-10 text-rf-accent animate-spin mb-4" />
                <p className="text-rf-text-2 font-medium">Cargando insumos...</p>
            </div>
        );
    }

    if (existencias.length === 0) {
        return (
            <div className="text-center py-16 bg-rf-surface rounded-lg border border-rf-border">
                <p className="text-rf-text-2 font-medium">Todavía no hay insumos dados de alta.</p>
                <p className="text-rf-text-3 text-sm mt-1">El administrador los crea desde Inventario → Insumos.</p>
            </div>
        );
    }

    const infoModo = MODOS[modo];

    return (
        <div className="space-y-4 pb-28">
            {/* Los tres modos siempre visibles: menos pasos que un menú desplegable. */}
            <div className="grid grid-cols-3 gap-2">
                {Object.entries(MODOS).map(([clave, info]) => {
                    const Icono = info.icono;
                    const activo = modo === clave;
                    return (
                        <button
                            key={clave}
                            onClick={() => cambiarModo(clave)}
                            className={`flex flex-col items-center gap-1.5 py-4 px-2 rounded-lg border transition-all ${
                                activo
                                    ? 'bg-rf-accent-soft border-rf-accent-border text-rf-accent-ink font-semibold'
                                    : 'bg-rf-surface border-rf-border text-rf-text-2'
                            }`}
                        >
                            <Icono size={22} className={activo ? '' : info.color} />
                            <span className="text-sm text-center leading-tight">{info.etiqueta}</span>
                        </button>
                    );
                })}
            </div>

            <p className="text-sm text-rf-text-2 px-1">{infoModo.ayuda}</p>

            <div>
                <input
                    type="text"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder={modo === 'MERMA' ? 'Motivo (obligatorio)' : 'Nota (opcional)'}
                    className="w-full h-12 px-4 rounded-lg bg-rf-surface border border-rf-border
                               text-rf-text placeholder:text-rf-text-3 focus:outline-none focus:border-rf-accent"
                />
                {modo === 'MERMA' && !motivo.trim() && (
                    <p className="text-xs text-rf-text-3 mt-1 px-1">
                        Sin motivo no se puede guardar: dentro de un mes nadie va a recordar qué pasó.
                    </p>
                )}
            </div>

            <div className="space-y-2">
                {existencias.map(item => (
                    <RenglonInsumo
                        key={item.id_insumos}
                        item={item}
                        valor={cantidades[item.id_insumos] ?? 0}
                        onCambiar={(v) => fijar(item.id_insumos, v)}
                        modo={modo}
                    />
                ))}
            </div>

            {/* Fijo abajo: en una lista larga, un botón al final obliga a buscarlo. */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-rf-surface border-t border-rf-border shadow-rf-lg">
                <button
                    onClick={guardar}
                    disabled={!listoParaGuardar || guardando}
                    className="w-full h-16 rounded-lg bg-rf-accent text-white text-lg font-bold
                               flex items-center justify-center gap-2 active:scale-[.98] transition-transform
                               disabled:opacity-40 disabled:active:scale-100"
                >
                    {guardando
                        ? <><Loader2 className="animate-spin" size={22} /> Guardando...</>
                        : <><Check size={22} /> {modo === 'CONTEO'
                            ? `Guardar conteo (${existencias.length})`
                            : `Guardar (${conCantidad.length})`}</>}
                </button>
            </div>
        </div>
    );
};

export default CapturaPanel;
