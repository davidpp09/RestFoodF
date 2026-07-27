import { useState, useEffect, useMemo } from 'react';
import { Loader2, Search, Save, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useInsumos } from '@/hooks/useInventario';
import { inventarioService } from '@/services/inventarioService';
import { productoService } from '@/services/productoService';

/**
 * Recetas: qué platillo consume qué insumo.
 *
 * La pantalla es centrada en el INSUMO, no en el platillo. Son 19 insumos
 * contra 225 productos: eliges "Pechuga de pollo" una vez y marcas de un
 * jalón los platillos que la llevan. Al revés habría que abrir 225 platillos
 * y en cada uno recordar qué insumos existen.
 *
 * Ojo con los nombres: /productos devuelve el identificador como `id`,
 * mientras que /inventario/insumos lo devuelve como `id_insumos`. No es un
 * capricho de esta pantalla — son dos convenciones distintas en la API. Dar
 * por sentada la del otro lado dejó las casillas sin marcar y la selección
 * escribiendo en una clave `undefined`.
 *
 * Guardar reemplaza la receta completa del insumo. Es a propósito: con altas
 * y bajas sueltas, una desmarcada que no se guardara dejaría una relación
 * fantasma descontando inventario sin que nadie lo notara.
 */
const RecetasPanel = () => {
    const { insumos, loading: cargandoInsumos } = useInsumos();
    const [productos, setProductos] = useState([]);
    const [insumoActivo, setInsumoActivo] = useState(null);
    const [seleccion, setSeleccion] = useState({});   // { id_producto: cantidad }
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('TODOS');
    const [relaciones, setRelaciones] = useState([]);
    const [cargandoReceta, setCargandoReceta] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const cargarRelaciones = () => inventarioService.obtenerTodasLasRecetas()
        .then(setRelaciones)
        .catch(() => toast.error('No se pudo cargar el panorama de recetas'));

    useEffect(() => {
        productoService.obtenerTodos()
            .then(setProductos)
            .catch(() => toast.error('No se pudieron cargar los platillos'));
        cargarRelaciones();
    }, []);

    // Para cada platillo, en qué insumos está colgado. Es lo que permite ver
    // que un platillo ya pertenece a otro insumo antes de marcarlo aquí.
    const insumosPorProducto = useMemo(() => {
        const mapa = {};
        for (const r of relaciones) {
            (mapa[r.id_producto] ??= []).push({ id: r.id_insumo, nombre: r.insumo });
        }
        return mapa;
    }, [relaciones]);

    const elegirInsumo = async (insumo) => {
        setInsumoActivo(insumo);
        setBusqueda('');
        setFiltro('TODOS');
        setCargandoReceta(true);
        try {
            const receta = await inventarioService.obtenerReceta(insumo.id_insumos);
            setSeleccion(Object.fromEntries(receta.platillos.map(p => [p.id_producto, p.cantidad])));
        } catch (error) {
            toast.error(error.response?.data?.mensaje || 'No se pudo cargar la receta');
            setSeleccion({});
        } finally {
            setCargandoReceta(false);
        }
    };

    const alternar = (id) => setSeleccion(prev => {
        const copia = { ...prev };
        if (copia[id]) delete copia[id]; else copia[id] = 1;
        return copia;
    });

    const cambiarCantidad = (id, cantidad) =>
        setSeleccion(prev => ({ ...prev, [id]: Math.max(1, cantidad) }));

    const guardar = async () => {
        setGuardando(true);
        try {
            const lineas = Object.entries(seleccion)
                .map(([id_producto, cantidad]) => ({ id_producto: Number(id_producto), cantidad }));
            await inventarioService.guardarReceta(insumoActivo.id_insumos, lineas);
            await cargarRelaciones();   // el panorama cambió: se recarga para que los filtros no mientan
            toast.success(`Receta guardada: ${lineas.length} platillo(s) con ${insumoActivo.nombre}`);
        } catch (error) {
            toast.error(error.response?.data?.mensaje || 'No se pudo guardar la receta');
        } finally {
            setGuardando(false);
        }
    };

    /** Los insumos DISTINTOS al activo en los que ya está este platillo. */
    const otrosInsumosDe = (idProducto) =>
        (insumosPorProducto[idProducto] ?? []).filter(i => i.id !== insumoActivo?.id_insumos);

    const visibles = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();
        const pasaFiltro = (p) => {
            const otros = (insumosPorProducto[p.id] ?? []).filter(i => i.id !== insumoActivo?.id_insumos);
            switch (filtro) {
                case 'MARCADOS':  return Boolean(seleccion[p.id]);
                // Repetidos: ya cuelgan de otro insumo. Puede ser correcto (un
                // gratinado lleva carne Y queso) o un error de captura — por eso
                // se muestran, no se ocultan.
                case 'REPETIDOS': return otros.length > 0;
                // Sin ningún insumo en todo el sistema: o falta darlos de alta,
                // o se decidió a conciencia no controlarlos.
                case 'SIN_INSUMO': return (insumosPorProducto[p.id] ?? []).length === 0;
                default:          return true;
            }
        };
        return productos
            .filter(pasaFiltro)
            .filter(p => !texto || p.nombre.toLowerCase().includes(texto))
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
    }, [productos, busqueda, filtro, seleccion, insumosPorProducto, insumoActivo]);

    const marcados = Object.keys(seleccion).length;
    const totalRepetidos = productos.filter(p => (insumosPorProducto[p.id] ?? []).length > 1).length;
    const totalSinInsumo = productos.filter(p => (insumosPorProducto[p.id] ?? []).length === 0).length;

    if (cargandoInsumos) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-10 h-10 text-rf-accent animate-spin mb-4" />
                <p className="text-rf-text-2 font-medium">Cargando insumos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-rf-text">Recetas</h1>
                <p className="text-rf-text-2">Qué platillo consume qué insumo</p>
            </div>

            {/* Elegir insumo: la lista corta va primero porque es el eje del trabajo. */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {insumos.map(i => (
                    <button
                        key={i.id_insumos}
                        onClick={() => elegirInsumo(i)}
                        className={`shrink-0 px-4 h-11 rounded-md border text-sm font-medium transition-colors ${
                            insumoActivo?.id_insumos === i.id_insumos
                                ? 'bg-rf-accent-soft border-rf-accent-border text-rf-accent-ink font-semibold'
                                : 'bg-rf-surface border-rf-border text-rf-text-2'
                        }`}
                    >
                        {i.nombre}
                    </button>
                ))}
            </div>

            {!insumoActivo ? (
                <div className="text-center py-16 bg-rf-surface rounded-lg border border-rf-border">
                    <p className="text-rf-text-2 font-medium">Elige un insumo para ver qué platillos lo llevan.</p>
                </div>
            ) : cargandoReceta ? (
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="w-8 h-8 text-rf-accent animate-spin" />
                </div>
            ) : (
                <>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-rf-text-3" />
                            <input
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Buscar platillo..."
                                className="w-full h-11 pl-10 pr-4 rounded-md bg-rf-surface border border-rf-border
                                           text-rf-text placeholder:text-rf-text-3 focus:outline-none focus:border-rf-accent"
                            />
                        </div>
                        {[
                            { clave: 'TODOS',      texto: `Todos (${productos.length})` },
                            { clave: 'MARCADOS',   texto: `Marcados (${marcados})` },
                            { clave: 'REPETIDOS',  texto: `En varios insumos (${totalRepetidos})` },
                            { clave: 'SIN_INSUMO', texto: `Sin insumo (${totalSinInsumo})` },
                        ].map(f => (
                            <button
                                key={f.clave}
                                onClick={() => setFiltro(f.clave)}
                                className={`h-11 px-4 rounded-md border text-sm font-medium whitespace-nowrap ${
                                    filtro === f.clave
                                        ? 'bg-rf-accent-soft border-rf-accent-border text-rf-accent-ink'
                                        : 'bg-rf-surface border-rf-border text-rf-text-2'
                                }`}
                            >
                                {f.texto}
                            </button>
                        ))}
                        <button
                            onClick={guardar}
                            disabled={guardando}
                            className="h-11 px-5 rounded-md bg-rf-accent text-white font-semibold
                                       flex items-center gap-2 active:scale-95 transition-transform disabled:opacity-40"
                        >
                            {guardando ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Guardar
                        </button>
                    </div>

                    <p className="text-sm text-rf-text-2 px-1">
                        Marca los platillos que llevan <strong className="text-rf-text">{insumoActivo.nombre}</strong>.
                        Si uno lleva más de una {insumoActivo.unidad === 'PIEZA' ? 'pieza' : 'porción'}, cambia el número.
                    </p>

                    <div className="space-y-1.5">
                        {visibles.map(p => {
                            const marcado = Boolean(seleccion[p.id]);
                            return (
                                <div
                                    key={p.id}
                                    className={`flex items-center gap-3 p-3 rounded-md border transition-colors ${
                                        marcado ? 'bg-rf-accent-soft border-rf-accent-border' : 'bg-rf-surface border-rf-border'
                                    }`}
                                >
                                    <button
                                        onClick={() => alternar(p.id)}
                                        className={`size-10 shrink-0 rounded-md border flex items-center justify-center ${
                                            marcado
                                                ? 'bg-rf-accent border-rf-accent text-white'
                                                : 'bg-rf-bg border-rf-border'
                                        }`}
                                        aria-label={`${marcado ? 'Quitar' : 'Agregar'} ${p.nombre}`}
                                    >
                                        {marcado && <Check size={20} />}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <span className="text-rf-text block truncate">{p.nombre}</span>
                                        {otrosInsumosDe(p.id).length > 0 && (
                                            <span className="flex items-center gap-1 text-xs text-rf-text-3 mt-0.5">
                                                <AlertTriangle size={12} className="shrink-0" />
                                                también en: {otrosInsumosDe(p.id).map(i => i.nombre).join(', ')}
                                            </span>
                                        )}
                                    </div>

                                    {marcado && (
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                onClick={() => cambiarCantidad(p.id, seleccion[p.id] - 1)}
                                                className="size-10 rounded-md bg-rf-surface-2 border border-rf-border text-xl font-bold"
                                                aria-label="Menos"
                                            >−</button>
                                            <span className="w-10 text-center font-bold text-lg text-rf-text tabular-nums">
                                                {seleccion[p.id]}
                                            </span>
                                            <button
                                                onClick={() => cambiarCantidad(p.id, seleccion[p.id] + 1)}
                                                className="size-10 rounded-md bg-rf-surface-2 border border-rf-border text-xl font-bold"
                                                aria-label="Más"
                                            >+</button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {visibles.length === 0 && (
                            <p className="text-center py-10 text-rf-text-3">Ningún platillo coincide.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default RecetasPanel;
