import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Sun, Power, UtensilsCrossed, AlertCircle, Pencil, Check, X } from 'lucide-react';
import api from '@/api/axiosConfig';
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

const svc = {
    productos:    ()          => api.get('/productos').then(r => r.data),
    categorias:   ()          => api.get('/categorias').then(r => r.data),
    actualizarDia:(id, datos) => api.patch(`/productos/${id}/dia`, datos).then(r => r.data),
    desactivarDia:(catId)     => api.put(`/productos/desactivar-dia/${catId}`),
};

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
            const [prods, cats] = await Promise.all([svc.productos(), svc.categorias()]);
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
            const actualizado = await svc.actualizarDia(producto.id, { disponibilidad: activando });
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
            const actualizado = await svc.actualizarDia(producto.id, { precio_comida: precio });
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
            await svc.desactivarDia(categoriaId);
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

    if (cargando) return <div className="text-slate-400">Cargando platillos...</div>;

    if (!categoriaId) return (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
            <AlertCircle size={40} className="text-slate-600 opacity-40" />
            <p className="font-bold text-slate-400">Categoría no encontrada</p>
            <p className="text-sm text-slate-500">
                Pide al administrador que cree la categoría{' '}
                <span className="text-amber-400 font-semibold">"Comida del día"</span>
            </p>
        </div>
    );

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                        <Sun size={22} className="text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white">Platillos del Día</h1>
                        <p className="text-slate-400 text-sm">{activos} / {MAX_ACTIVOS} activos hoy</p>
                    </div>
                </div>

                {activos > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                disabled={cerrando}
                                className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold px-4 py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50"
                            >
                                <Power size={15} />
                                {cerrando ? 'Cerrando...' : 'Cerrar Día'}
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">¿Cerrar el día?</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-400">
                                    Se desactivarán los <span className="text-white font-semibold">{activos} platillos</span> activos.
                                    El mesero dejará de verlos en el menú.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="border-slate-700 text-slate-300 hover:text-white bg-transparent hover:bg-slate-800">
                                    Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleCerrarDia}
                                    className="bg-red-500 hover:bg-red-600 text-white border-transparent"
                                >
                                    Sí, cerrar día
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            {/* Barra de progreso */}
            <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest shrink-0">Activos</span>
                <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${activos >= MAX_ACTIVOS ? 'bg-red-500' : 'bg-amber-500'}`}
                        style={{ width: `${porcentaje}%` }}
                    />
                </div>
                <span className={`text-sm font-black shrink-0 tabular-nums ${activos >= MAX_ACTIVOS ? 'text-red-400' : 'text-amber-400'}`}>
                    {activos} / {MAX_ACTIVOS}
                </span>
            </div>

            {/* Lista de platillos */}
            {productosDia.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-600 bg-slate-900 border border-slate-800 rounded-2xl">
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
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all ${
                                    p.disponibilidad
                                        ? 'bg-emerald-500/5 border-emerald-500/20'
                                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                {/* Toggle switch */}
                                <button
                                    onClick={() => handleToggle(p)}
                                    disabled={bloqueado}
                                    className={`relative shrink-0 w-11 h-6 rounded-full transition-colors focus:outline-none ${
                                        p.disponibilidad ? 'bg-emerald-500' : bloqueado ? 'bg-slate-700 opacity-40 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-600'
                                    }`}
                                >
                                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${p.disponibilidad ? 'left-[22px]' : 'left-0.5'}`} />
                                </button>

                                {/* Nombre */}
                                <span className={`flex-1 font-semibold text-sm ${p.disponibilidad ? 'text-white' : 'text-slate-500'}`}>
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
                                            className="w-20 bg-slate-800 border border-amber-500 rounded-lg px-2 py-1 text-white text-sm outline-none text-right"
                                            autoFocus
                                        />
                                        <button onClick={() => handleGuardarPrecio(p)} className="w-7 h-7 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center transition-colors">
                                            <Check size={13} className="text-emerald-400" />
                                        </button>
                                        <button onClick={() => setEditandoPrecio(null)} className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center transition-colors">
                                            <X size={13} className="text-slate-400" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { setEditandoPrecio(p.id); setPrecioTemp(String(p.precioComida)); }}
                                        className="flex items-center gap-1.5 shrink-0 group"
                                        title="Clic para editar precio"
                                    >
                                        <span className={`font-mono text-sm font-bold transition-colors ${p.disponibilidad ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                            ${Number(p.precioComida).toFixed(2)}
                                        </span>
                                        <Pencil size={11} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
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
