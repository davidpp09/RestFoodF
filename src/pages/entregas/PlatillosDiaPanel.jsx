import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Sun, Power, UtensilsCrossed, AlertCircle, Pencil, Check, X, FileText, Download, ExternalLink, Plus, Archive } from 'lucide-react';
import { productoService } from '@/services/productoService';
import { categoriaService } from '@/services/categoriaService';
import { menuDiaService } from '@/services/menuDiaService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Solo el respaldo por si el backend no mandara el tope: el bueno viene en
// la categor\u00eda (columna max_activos), para que PDF y pantalla no se separen.
const TOPE_POR_DEFECTO = 7;
const norm = s => s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Con responseType blob, un error del backend tambi\u00e9n llega como Blob:
// hay que leerlo para sacar el mensaje en vez de mostrar "[object Blob]".
const mensajeDeError = async (error) => {
    const data = error?.response?.data;
    if (data instanceof Blob) {
        try {
            return JSON.parse(await data.text())?.mensaje;
        } catch {
            return null;
        }
    }
    return data?.mensaje;
};

const PlatillosDiaPanel = () => {
    const [productos,      setProductos]      = useState([]);
    const [categoriaId,    setCategoriaId]    = useState(null);
    const [maxActivos,     setMaxActivos]     = useState(TOPE_POR_DEFECTO);
    const [cargando,       setCargando]       = useState(true);
    const [cerrando,       setCerrando]       = useState(false);
    const [editandoPrecio, setEditandoPrecio] = useState(null);
    const [precioTemp,     setPrecioTemp]     = useState('');
    const [generandoPdf,   setGenerandoPdf]   = useState(false);
    const [urlPdf,         setUrlPdf]         = useState(null);
    const [dialogNuevo,    setDialogNuevo]    = useState(false);
    const [nuevoNombre,    setNuevoNombre]    = useState('');
    const [nuevoPrecio,    setNuevoPrecio]    = useState('');
    const [creando,        setCreando]        = useState(false);

    const cargar = async () => {
        try {
            const [prods, cats] = await Promise.all([productoService.obtenerTodos(), categoriaService.obtenerTodas()]);
            const catDia = cats.find(c => norm(c.nombre) === 'comida del dia');
            if (catDia) {
                setCategoriaId(catDia.id);
                setMaxActivos(catDia.maxActivos ?? TOPE_POR_DEFECTO);
            }
            setProductos(prods);
        } catch {
            toast.error('Error al cargar datos');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    // El blob queda en memoria hasta que se libera a mano.
    useEffect(() => {
        return () => { if (urlPdf) URL.revokeObjectURL(urlPdf); };
    }, [urlPdf]);

    const productosDia = productos.filter(p => categoriaId && p.categoria.id === categoriaId);
    const activos      = productosDia.filter(p => p.disponibilidad).length;
    const porcentaje   = (activos / maxActivos) * 100;

    const handleToggle = async (producto) => {
        const activando = !producto.disponibilidad;
        if (activando && activos >= maxActivos) {
            toast.error(`Máximo ${maxActivos} platillos activos a la vez`);
            return;
        }
        try {
            const actualizado = await productoService.actualizarDia(producto.id, { disponibilidad: activando });
            setProductos(prev => prev.map(p => p.id === actualizado.id ? actualizado : p));
        } catch {
            toast.error('Error al cambiar estado');
        }
    };

    const handleGuardarPrecio = async (producto) => {
        const precio = Number(precioTemp);
        if (!precioTemp || isNaN(precio) || precio < 0) {
            toast.error('Precio inválido');
            return;
        }
        try {
            const actualizado = await productoService.actualizarDia(producto.id, { precio_comida: precio });
            setProductos(prev => prev.map(p => p.id === actualizado.id ? actualizado : p));
            setEditandoPrecio(null);
            toast.success('Precio actualizado');
        } catch {
            toast.error('Error al actualizar precio');
        }
    };

    const handleCrear = async () => {
        const nombre = nuevoNombre.trim();
        const precio = Number(nuevoPrecio);

        if (nombre.length < 3) {
            toast.error('El nombre debe tener al menos 3 caracteres');
            return;
        }
        if (nombre.length > 60) {
            toast.error('Máximo 60 caracteres: más largo no cabe en el renglón del menú');
            return;
        }
        if (!nuevoPrecio || isNaN(precio) || precio <= 0) {
            toast.error('Precio inválido');
            return;
        }

        setCreando(true);
        try {
            const creado = await productoService.crearDia({ nombre, precio });
            setProductos(prev => [...prev, creado]);
            setNuevoNombre('');
            setNuevoPrecio('');
            setDialogNuevo(false);
            toast.success(`"${creado.nombre}" agregado. Actívalo para ponerlo en el menú de hoy.`);
        } catch (error) {
            toast.error(error?.response?.data?.mensaje ?? 'No se pudo agregar el platillo');
        } finally {
            setCreando(false);
        }
    };

    const handleArchivar = async (producto) => {
        try {
            await productoService.archivarDia(producto.id);
            setProductos(prev => prev.filter(p => p.id !== producto.id));
            toast.success(`"${producto.nombre}" archivado`);
        } catch (error) {
            toast.error(error?.response?.data?.mensaje ?? 'No se pudo archivar');
        }
    };

    const handleVerMenu = async () => {
        setGenerandoPdf(true);
        try {
            const blob = await menuDiaService.obtenerPdf();
            if (urlPdf) URL.revokeObjectURL(urlPdf);
            setUrlPdf(URL.createObjectURL(blob));
        } catch (error) {
            toast.error(await mensajeDeError(error) ?? 'No se pudo generar el menú');
        } finally {
            setGenerandoPdf(false);
        }
    };

    const handleDescargar = () => {
        const enlace = document.createElement('a');
        enlace.href = urlPdf;
        enlace.download = `menu-del-dia-${new Date().toISOString().slice(0, 10)}.pdf`;
        enlace.click();
    };

    const handleCerrarDia = async () => {
        setCerrando(true);
        try {
            await productoService.desactivarDia(categoriaId);
            setProductos(prev =>
                prev.map(p => p.categoria.id === categoriaId ? { ...p, disponibilidad: false } : p)
            );
            toast.success('Día cerrado — todos los platillos desactivados');
        } catch {
            toast.error('Error al cerrar el día');
        } finally {
            setCerrando(false);
        }
    };

    if (cargando) return <div className="text-rf-text-2">Cargando platillos...</div>;

    if (!categoriaId) return (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
            <AlertCircle size={40} className="text-rf-text-3 opacity-40" />
            <p className="font-bold text-rf-text-2">Categoría no encontrada</p>
            <p className="text-sm text-rf-text-3">
                Pide al administrador que cree la categoría{' '}
                <span className="text-rf-accent-ink font-semibold">"Comida del día"</span>
            </p>
        </div>
    );

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-rf-accent-soft p-3 rounded-md border border-rf-accent-border">
                        <Sun size={22} className="text-rf-accent-ink" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-rf-text">Platillos del Día</h1>
                        <p className="text-rf-text-2 text-sm">{activos} / {maxActivos} activos hoy</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">

                <button
                    onClick={() => setDialogNuevo(true)}
                    className="inline-flex items-center gap-2 bg-rf-green-soft hover:bg-rf-green-soft/80 border border-rf-green/40 text-rf-green-ink font-bold px-4 py-2.5 rounded-md transition-colors text-sm"
                >
                    <Plus size={15} />
                    Nuevo platillo
                </button>

                {activos > 0 && (
                    <button
                        onClick={handleVerMenu}
                        disabled={generandoPdf}
                        className="inline-flex items-center gap-2 bg-rf-accent-soft hover:bg-rf-accent-soft/80 border border-rf-accent-border text-rf-accent-ink font-bold px-4 py-2.5 rounded-md transition-colors text-sm disabled:opacity-50"
                    >
                        <FileText size={15} />
                        {generandoPdf ? 'Generando...' : 'Ver menú del día'}
                    </button>
                )}

                {activos > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                disabled={cerrando}
                                className="inline-flex items-center gap-2 bg-rf-red-soft hover:bg-rf-red-soft/80 border border-rf-red/40 text-rf-red-ink font-bold px-4 py-2.5 rounded-md transition-colors text-sm disabled:opacity-50"
                            >
                                <Power size={15} />
                                {cerrando ? 'Cerrando...' : 'Cerrar Día'}
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-rf-surface border-rf-border text-rf-text">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-rf-text">¿Cerrar el día?</AlertDialogTitle>
                                <AlertDialogDescription className="text-rf-text-2">
                                    Se desactivarán los <span className="text-rf-text font-semibold">{activos} platillos</span> activos.
                                    El mesero dejará de verlos en el menú.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="border-rf-border-strong text-rf-text-2 hover:text-rf-text bg-transparent hover:bg-rf-surface-2">
                                    Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleCerrarDia}
                                    className="bg-rf-red hover:bg-rf-red/90 text-white border-transparent"
                                >
                                    Sí, cerrar día
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                </div>
            </div>

            {/* Alta de un platillo del día */}
            <Dialog open={dialogNuevo} onOpenChange={setDialogNuevo}>
                <DialogContent className="bg-rf-surface border-rf-border text-rf-text max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-rf-text flex items-center gap-2">
                            <Plus size={18} className="text-rf-green-ink" />
                            Nuevo platillo del día
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-rf-text-3 uppercase tracking-widest mb-1.5">
                                Nombre
                            </label>
                            <input
                                type="text"
                                value={nuevoNombre}
                                maxLength={60}
                                onChange={e => setNuevoNombre(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleCrear(); }}
                                placeholder="Pollo en pipián"
                                className="w-full bg-rf-bg border border-rf-border-strong focus:border-rf-accent rounded-md px-3 py-2.5 text-rf-text outline-none"
                                autoFocus
                            />
                            <p className="text-xs text-rf-text-3 mt-1">
                                {nuevoNombre.trim().length}/60 — así se va a ver impreso:{' '}
                                <span className="font-mono text-rf-text-2">
                                    {nuevoNombre.trim().toUpperCase() || 'NOMBRE DEL PLATILLO'}
                                </span>
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-rf-text-3 uppercase tracking-widest mb-1.5">
                                Precio
                            </label>
                            <input
                                type="text"
                                inputMode="decimal"
                                value={nuevoPrecio}
                                onChange={e => setNuevoPrecio(e.target.value.replace(/[^0-9.]/g, ''))}
                                onKeyDown={e => { if (e.key === 'Enter') handleCrear(); }}
                                placeholder="105"
                                className="w-full bg-rf-bg border border-rf-border-strong focus:border-rf-accent rounded-md px-3 py-2.5 text-rf-text outline-none"
                            />
                        </div>

                        <p className="text-xs text-rf-text-3">
                            Se agrega apagado. Para que salga en el menú de hoy hay que activarlo
                            con el switch.
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => setDialogNuevo(false)}
                            className="px-4 py-2.5 rounded-md border border-rf-border-strong text-rf-text-2 hover:text-rf-text hover:bg-rf-surface-2 transition-colors text-sm font-bold"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleCrear}
                            disabled={creando}
                            className="inline-flex items-center gap-2 bg-rf-green hover:bg-rf-green/90 text-white font-bold px-4 py-2.5 rounded-md transition-colors text-sm disabled:opacity-50"
                        >
                            <Plus size={15} />
                            {creando ? 'Agregando...' : 'Agregar'}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Vista previa del menú en PDF. Se revisa antes de mandarlo a los
                clientes: es más barato cachar una errata aquí que en WhatsApp. */}
            <Dialog open={!!urlPdf} onOpenChange={abierto => { if (!abierto) setUrlPdf(null); }}>
                <DialogContent className="bg-rf-surface border-rf-border text-rf-text max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="text-rf-text flex items-center gap-2">
                            <FileText size={18} className="text-rf-accent-ink" />
                            Menú del día
                        </DialogTitle>
                    </DialogHeader>

                    <iframe
                        src={urlPdf ?? ''}
                        title="Vista previa del menú del día"
                        className="w-full h-[60vh] rounded-md border border-rf-border bg-white"
                    />

                    <p className="text-xs text-rf-text-3">
                        Si la vista previa sale en blanco (pasa en las tablets Android, que no
                        traen visor de PDF), usa <span className="text-rf-text-2 font-semibold">Abrir</span> o
                        <span className="text-rf-text-2 font-semibold"> Descargar</span>.
                    </p>

                    <div className="flex items-center justify-end gap-2 flex-wrap">
                        <a
                            href={urlPdf ?? ''}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-rf-surface-2 hover:bg-rf-border border border-rf-border-strong text-rf-text-2 hover:text-rf-text font-bold px-4 py-2.5 rounded-md transition-colors text-sm"
                        >
                            <ExternalLink size={15} />
                            Abrir
                        </a>
                        <button
                            onClick={handleDescargar}
                            className="inline-flex items-center gap-2 bg-rf-green hover:bg-rf-green/90 text-white font-bold px-4 py-2.5 rounded-md transition-colors text-sm"
                        >
                            <Download size={15} />
                            Descargar
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Barra de progreso */}
            <div className="flex items-center gap-4 bg-rf-surface border border-rf-border rounded-md px-4 py-3">
                <span className="text-xs font-bold text-rf-text-3 uppercase tracking-widest shrink-0">Activos</span>
                <div className="flex-1 bg-rf-surface-2 rounded-full h-2 overflow-hidden">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${activos >= maxActivos ? 'bg-rf-red' : 'bg-rf-accent'}`}
                        style={{ width: `${porcentaje}%` }}
                    />
                </div>
                <span className={`text-sm font-bold shrink-0 tabular-nums ${activos >= maxActivos ? 'text-rf-red-ink' : 'text-rf-accent-ink'}`}>
                    {activos} / {maxActivos}
                </span>
            </div>

            {/* Lista de platillos */}
            {productosDia.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-rf-text-3 bg-rf-surface border border-rf-border rounded-lg">
                    <UtensilsCrossed size={36} className="mb-3 opacity-30" />
                    <p className="font-semibold">No hay platillos en la categoría</p>
                    <p className="text-xs mt-1">Agrega platillos desde el panel de administración</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {productosDia.map(p => {
                        const bloqueado = !p.disponibilidad && activos >= maxActivos;
                        return (
                            <div
                                key={p.id}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-md border transition-all ${
                                    p.disponibilidad
                                        ? 'bg-rf-green-soft/60 border-rf-green/40'
                                        : 'bg-rf-surface border-rf-border hover:border-rf-border-strong'
                                }`}
                            >
                                {/* Toggle switch */}
                                <button
                                    onClick={() => handleToggle(p)}
                                    disabled={bloqueado}
                                    className={`relative shrink-0 w-11 h-6 rounded-full transition-colors focus:outline-none ${
                                        p.disponibilidad ? 'bg-rf-green' : bloqueado ? 'bg-rf-border-strong opacity-40 cursor-not-allowed' : 'bg-rf-border-strong'
                                    }`}
                                >
                                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${p.disponibilidad ? 'left-[22px]' : 'left-0.5'}`} />
                                </button>

                                {/* Nombre */}
                                <span className={`flex-1 font-semibold text-sm ${p.disponibilidad ? 'text-rf-text' : 'text-rf-text-3'}`}>
                                    {p.nombre}
                                </span>

                                {/* Precio editable */}
                                {editandoPrecio === p.id ? (
                                    <div className="flex items-center gap-2 shrink-0">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={precioTemp}
                                            onChange={e => {
                                                const val = e.target.value.replace(/[^0-9.]/g, '');
                                                setPrecioTemp(val);
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') handleGuardarPrecio(p);
                                                if (e.key === 'Escape') setEditandoPrecio(null);
                                            }}
                                            className="w-20 bg-rf-bg border border-rf-accent rounded-md px-2 py-1 text-rf-text text-sm outline-none text-right"
                                            autoFocus
                                        />
                                        <button onClick={() => handleGuardarPrecio(p)} className="w-7 h-7 rounded-lg bg-rf-green-soft hover:bg-rf-green-soft/80 border border-rf-green/30 flex items-center justify-center transition-colors">
                                            <Check size={13} className="text-rf-green-ink" />
                                        </button>
                                        <button onClick={() => setEditandoPrecio(null)} className="w-7 h-7 rounded-lg bg-rf-surface-2 hover:bg-rf-border border border-rf-border-strong flex items-center justify-center transition-colors">
                                            <X size={13} className="text-rf-text-2" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { setEditandoPrecio(p.id); setPrecioTemp(String(p.precioComida)); }}
                                        className="flex items-center gap-1.5 shrink-0 group"
                                        title="Clic para editar precio"
                                    >
                                        <span className={`font-mono text-sm font-bold transition-colors ${p.disponibilidad ? 'text-rf-green-ink' : 'text-rf-text-3 group-hover:text-rf-text-2'}`}>
                                            ${Number(p.precioComida).toFixed(0)}
                                        </span>
                                        <Pencil size={11} className="text-rf-text-3 group-hover:text-rf-text-2 transition-colors" />
                                    </button>
                                )}

                                {/* Archivar. Solo para los apagados: si está en el menú de hoy,
                                    primero se apaga — así no desaparece de golpe algo que las
                                    meseras están vendiendo en este momento. */}
                                {!p.disponibilidad && editandoPrecio !== p.id && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button
                                                className="shrink-0 w-7 h-7 rounded-lg bg-rf-surface-2 hover:bg-rf-red-soft border border-rf-border-strong hover:border-rf-red/40 flex items-center justify-center transition-colors group/arch"
                                                title="Archivar platillo"
                                            >
                                                <Archive size={12} className="text-rf-text-3 group-hover/arch:text-rf-red-ink transition-colors" />
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="bg-rf-surface border-rf-border text-rf-text">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="text-rf-text">¿Archivar platillo?</AlertDialogTitle>
                                                <AlertDialogDescription className="text-rf-text-2">
                                                    <span className="text-rf-text font-semibold">{p.nombre}</span> sale
                                                    de la lista. Las ventas viejas se conservan, y si algún día
                                                    vuelve a darse de alta con el mismo nombre se reutiliza este registro.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="border-rf-border-strong text-rf-text-2 hover:text-rf-text bg-transparent hover:bg-rf-surface-2">
                                                    Cancelar
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleArchivar(p)}
                                                    className="bg-rf-red hover:bg-rf-red/90 text-white border-transparent"
                                                >
                                                    Sí, archivar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PlatillosDiaPanel;
