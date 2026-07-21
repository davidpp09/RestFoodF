import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Sun, Power, UtensilsCrossed, AlertCircle, Pencil, Check, X } from 'lucide-react';
import { productoService } from '@/services/productoService';
import { categoriaService } from '@/services/categoriaService';
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

const MAX_ACTIVOS = 7;
const norm = s => s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const PlatillosDiaPanel = () => {
    const [productos,      setProductos]      = useState([]);
    const [categoriaId,    setCategoriaId]    = useState(null);
    const [cargando,       setCargando]       = useState(true);
    const [cerrando,       setCerrando]       = useState(false);
    const [editandoPrecio, setEditandoPrecio] = useState(null);
    const [precioTemp,     setPrecioTemp]     = useState('');

    const cargar = async () => {
        try {
            const [prods, cats] = await Promise.all([productoService.obtenerTodos(), categoriaService.obtenerTodas()]);
            const catDia = cats.find(c => norm(c.nombre) === 'comida del dia');
            if (catDia) setCategoriaId(catDia.id);
            setProductos(prods);
        } catch {
            toast.error('Error al cargar datos');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    const productosDia = productos.filter(p => categoriaId && p.categoria.id === categoriaId);
    const activos      = productosDia.filter(p => p.disponibilidad).length;
    const porcentaje   = (activos / MAX_ACTIVOS) * 100;

    const handleToggle = async (producto) => {
        const activando = !producto.disponibilidad;
        if (activando && activos >= MAX_ACTIVOS) {
            toast.error(`Máximo ${MAX_ACTIVOS} platillos activos a la vez`);
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
                        <p className="text-rf-text-2 text-sm">{activos} / {MAX_ACTIVOS} activos hoy</p>
                    </div>
                </div>

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

            {/* Barra de progreso */}
            <div className="flex items-center gap-4 bg-rf-surface border border-rf-border rounded-md px-4 py-3">
                <span className="text-xs font-bold text-rf-text-3 uppercase tracking-widest shrink-0">Activos</span>
                <div className="flex-1 bg-rf-surface-2 rounded-full h-2 overflow-hidden">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${activos >= MAX_ACTIVOS ? 'bg-rf-red' : 'bg-rf-accent'}`}
                        style={{ width: `${porcentaje}%` }}
                    />
                </div>
                <span className={`text-sm font-bold shrink-0 tabular-nums ${activos >= MAX_ACTIVOS ? 'text-rf-red-ink' : 'text-rf-accent-ink'}`}>
                    {activos} / {MAX_ACTIVOS}
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
                        const bloqueado = !p.disponibilidad && activos >= MAX_ACTIVOS;
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
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PlatillosDiaPanel;
