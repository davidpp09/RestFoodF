import { useState } from 'react';
import { Loader2, Plus, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useInsumos } from '@/hooks/useInventario';
import { inventarioService } from '@/services/inventarioService';

/**
 * Alta y edición de insumos: define QUÉ se controla.
 *
 * Es decisión de negocio, no de operación — por eso vive en el panel de admin
 * y no en la tablet de cocina. De los 225 productos, aquí solo entran los que
 * valen la pena vigilar: el 20% de los insumos concentra el 80% del valor.
 */

const VACIO = { nombre: '', unidad: 'PIEZA', stock_minimo: 0 };

const Formulario = ({ valor, onCambiar, onGuardar, onCancelar, guardando, esEdicion }) => (
    <div className="p-4 bg-rf-surface rounded-lg border border-rf-accent-border space-y-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <input
                type="text"
                value={valor.nombre}
                onChange={(e) => onCambiar({ ...valor, nombre: e.target.value })}
                placeholder="Nombre del insumo (ej. Pechuga de pollo)"
                className="h-12 px-4 rounded-md bg-rf-bg border border-rf-border text-rf-text
                           placeholder:text-rf-text-3 focus:outline-none focus:border-rf-accent"
            />
            <select
                value={valor.unidad}
                onChange={(e) => onCambiar({ ...valor, unidad: e.target.value })}
                className="h-12 px-4 rounded-md bg-rf-bg border border-rf-border text-rf-text
                           focus:outline-none focus:border-rf-accent"
            >
                <option value="PIEZA">Piezas</option>
                <option value="PORCION">Porciones</option>
            </select>
            <input
                type="number"
                min="0"
                value={valor.stock_minimo}
                onChange={(e) => onCambiar({ ...valor, stock_minimo: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                placeholder="Mínimo"
                className="h-12 w-28 px-4 rounded-md bg-rf-bg border border-rf-border text-rf-text
                           focus:outline-none focus:border-rf-accent"
            />
        </div>
        <p className="text-xs text-rf-text-3">
            El mínimo dispara la alerta de "hay que comprar". Déjalo en 0 si no quieres que te avise de este insumo.
        </p>
        <div className="flex gap-2">
            <button
                onClick={onGuardar}
                disabled={!valor.nombre.trim() || guardando}
                className="h-11 px-5 rounded-md bg-rf-accent text-white font-semibold
                           active:scale-95 transition-transform disabled:opacity-40"
            >
                {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear insumo'}
            </button>
            <button
                onClick={onCancelar}
                className="h-11 px-5 rounded-md bg-rf-surface-2 border border-rf-border text-rf-text-2"
            >
                Cancelar
            </button>
        </div>
    </div>
);

const InsumosPanel = () => {
    const { insumos, loading, recargar } = useInsumos();
    const [formulario, setFormulario] = useState(null);   // null = cerrado
    const [editandoId, setEditandoId] = useState(null);
    const [guardando, setGuardando] = useState(false);

    const abrirNuevo = () => { setEditandoId(null); setFormulario(VACIO); };
    const abrirEdicion = (i) => {
        setEditandoId(i.id_insumos);
        setFormulario({ nombre: i.nombre, unidad: i.unidad, stock_minimo: i.stock_minimo });
    };
    const cerrar = () => { setFormulario(null); setEditandoId(null); };

    const guardar = async () => {
        setGuardando(true);
        try {
            if (editandoId) {
                await inventarioService.actualizarInsumo(editandoId, formulario);
                toast.success('Insumo actualizado');
            } else {
                await inventarioService.crearInsumo(formulario);
                toast.success('Insumo creado');
            }
            cerrar();
            recargar();
        } catch (error) {
            toast.error(error.response?.data?.mensaje || 'No se pudo guardar el insumo');
        } finally {
            setGuardando(false);
        }
    };

    const desactivar = async (insumo) => {
        // Se da de baja, no se borra: sus movimientos son historia y la FK los protege.
        if (!window.confirm(`¿Dar de baja "${insumo.nombre}"? Su historial se conserva.`)) return;
        try {
            await inventarioService.desactivarInsumo(insumo.id_insumos);
            toast.success('Insumo dado de baja');
            recargar();
        } catch (error) {
            toast.error(error.response?.data?.mensaje || 'No se pudo dar de baja');
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

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-rf-text">Insumos</h1>
                    <p className="text-rf-text-2">Qué se controla en el inventario</p>
                </div>
                {!formulario && (
                    <button
                        onClick={abrirNuevo}
                        className="flex items-center gap-2 h-11 px-5 rounded-md bg-rf-accent text-white
                                   font-semibold active:scale-95 transition-transform"
                    >
                        <Plus size={18} /> Nuevo insumo
                    </button>
                )}
            </div>

            {formulario && (
                <Formulario
                    valor={formulario}
                    onCambiar={setFormulario}
                    onGuardar={guardar}
                    onCancelar={cerrar}
                    guardando={guardando}
                    esEdicion={Boolean(editandoId)}
                />
            )}

            {insumos.length === 0 && !formulario ? (
                <div className="text-center py-16 bg-rf-surface rounded-lg border border-rf-border">
                    <p className="text-rf-text-2 font-medium">Todavía no hay insumos.</p>
                    <p className="text-rf-text-3 text-sm mt-1">
                        Empieza por los que más mueven: pechuga, milanesa, pollo deshebrado.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {insumos.map(i => (
                        <div key={i.id_insumos}
                             className="flex items-center gap-4 p-4 bg-rf-surface rounded-lg border border-rf-border">
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-rf-text truncate">{i.nombre}</p>
                                <p className="text-sm text-rf-text-3">
                                    {i.unidad === 'PIEZA' ? 'Piezas' : 'Porciones'}
                                    {' · '}
                                    {i.stock_minimo === 0 ? 'sin alerta' : `mínimo ${i.stock_minimo}`}
                                </p>
                            </div>
                            <button
                                onClick={() => abrirEdicion(i)}
                                className="size-11 flex items-center justify-center rounded-md bg-rf-surface-2
                                           border border-rf-border text-rf-text-2 active:scale-95 transition-transform"
                                aria-label={`Editar ${i.nombre}`}
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                onClick={() => desactivar(i)}
                                className="size-11 flex items-center justify-center rounded-md bg-rf-red-soft
                                           border border-rf-red text-rf-red-ink active:scale-95 transition-transform"
                                aria-label={`Dar de baja ${i.nombre}`}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InsumosPanel;
