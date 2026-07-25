import { useState, useEffect, useMemo } from 'react';
import { Loader2, Search, Save, Check } from 'lucide-react';
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
    const [soloMarcados, setSoloMarcados] = useState(false);
    const [cargandoReceta, setCargandoReceta] = useState(false);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        productoService.obtenerTodos()
            .then(setProductos)
            .catch(() => toast.error('No se pudieron cargar los platillos'));
    }, []);

    const elegirInsumo = async (insumo) => {
        setInsumoActivo(insumo);
        setBusqueda('');
        setSoloMarcados(false);
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
            toast.success(`Receta guardada: ${lineas.length} platillo(s) con ${insumoActivo.nombre}`);
        } catch (error) {
            toast.error(error.response?.data?.mensaje || 'No se pudo guardar la receta');
        } finally {
            setGuardando(false);
        }
    };

    const visibles = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();
        return productos
            .filter(p => !soloMarcados || seleccion[p.id_productos])
            .filter(p => !texto || p.nombre.toLowerCase().includes(texto))
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
    }, [productos, busqueda, soloMarcados, seleccion]);

    const marcados = Object.keys(seleccion).length;

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
                        <button
                            onClick={() => setSoloMarcados(v => !v)}
                            className={`h-11 px-4 rounded-md border text-sm font-medium ${
                                soloMarcados
                                    ? 'bg-rf-accent-soft border-rf-accent-border text-rf-accent-ink'
                                    : 'bg-rf-surface border-rf-border text-rf-text-2'
                            }`}
                        >
                            Solo marcados ({marcados})
                        </button>
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
                            const marcado = Boolean(seleccion[p.id_productos]);
                            return (
                                <div
                                    key={p.id_productos}
                                    className={`flex items-center gap-3 p-3 rounded-md border transition-colors ${
                                        marcado ? 'bg-rf-accent-soft border-rf-accent-border' : 'bg-rf-surface border-rf-border'
                                    }`}
                                >
                                    <button
                                        onClick={() => alternar(p.id_productos)}
                                        className={`size-10 shrink-0 rounded-md border flex items-center justify-center ${
                                            marcado
                                                ? 'bg-rf-accent border-rf-accent text-white'
                                                : 'bg-rf-bg border-rf-border'
                                        }`}
                                        aria-label={`${marcado ? 'Quitar' : 'Agregar'} ${p.nombre}`}
                                    >
                                        {marcado && <Check size={20} />}
                                    </button>

                                    <span className="flex-1 min-w-0 text-rf-text truncate">{p.nombre}</span>

                                    {marcado && (
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                onClick={() => cambiarCantidad(p.id_productos, seleccion[p.id_productos] - 1)}
                                                className="size-10 rounded-md bg-rf-surface-2 border border-rf-border text-xl font-bold"
                                                aria-label="Menos"
                                            >−</button>
                                            <span className="w-10 text-center font-bold text-lg text-rf-text tabular-nums">
                                                {seleccion[p.id_productos]}
                                            </span>
                                            <button
                                                onClick={() => cambiarCantidad(p.id_productos, seleccion[p.id_productos] + 1)}
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
