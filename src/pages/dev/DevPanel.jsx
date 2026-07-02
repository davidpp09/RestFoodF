import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ChefHat, CheckCircle2, XCircle, X, Search } from 'lucide-react';
import { productoService } from '@/services/productoService';
import { categoriaService } from '@/services/categoriaService';
import FormPlatilloDialog from './FormPlatilloDialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const DevPanel = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [dialog, setDialog] = useState(null); // null | 'nuevo' | producto
    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const [filtroCat, setFiltroCat] = useState('');
    const [busqueda, setBusqueda] = useState('');

    const cargar = async () => {
        try {
            const [prods, cats] = await Promise.all([productoService.obtenerTodos(), categoriaService.obtenerTodas()]);
            setProductos(prods);
            setCategorias(cats);
        } catch {
            toast.error('Error al cargar los datos');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    const handleCrear = async (payload) => {
        const nuevo = await productoService.crear(payload);
        setProductos(prev => [...prev, nuevo]);
        toast.success('Platillo creado');
    };

    const handleEditar = async (payload) => {
        const actualizado = await productoService.actualizar(dialog.id, payload);
        setProductos(prev => prev.map(p => p.id === actualizado.id ? actualizado : p));
        toast.success('Platillo actualizado');
    };

    const handleBorrar = async () => {
        const producto = productoAEliminar;
        setProductoAEliminar(null);
        try {
            await productoService.eliminar(producto.id);
            setProductos(prev => prev.filter(p => p.id !== producto.id));
            toast.success('Platillo eliminado');
        } catch {
            toast.error('Error al eliminar');
        }
    };

    const productosFiltrados = productos.filter(p => {
        const coincideCat = !filtroCat || p.categoria.nombre === filtroCat;
        const coincideBusqueda = !busqueda.trim() || p.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return coincideCat && coincideBusqueda;
    });

    if (cargando) return <div className="text-slate-400">Cargando platillos...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                        <ChefHat size={22} className="text-orange-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white">Platillos</h1>
                        <p className="text-slate-400 text-sm">{productos.length} platillos registrados</p>
                    </div>
                </div>
                <button
                    onClick={() => setDialog('nuevo')}
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-black px-4 py-2.5 rounded-xl transition-colors text-sm"
                >
                    <Plus size={18} /> Nuevo Platillo
                </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    placeholder="Buscar platillo..."
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-orange-500 transition-colors"
                />
                {busqueda && (
                    <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Filtro por categoría */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setFiltroCat('')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${!filtroCat ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                >
                    Todos
                </button>
                {categorias.map(c => (
                    <button
                        key={c.id}
                        onClick={() => setFiltroCat(c.nombre)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${filtroCat === c.nombre ? 'bg-orange-500 border-orange-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                    >
                        {c.nombre}
                    </button>
                ))}
            </div>

            {/* Tabla */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-800/50">
                            <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Platillo</th>
                            <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Categoría</th>
                            <th className="text-right px-4 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Comida</th>
                            <th className="text-right px-4 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Desayuno</th>
                            <th className="text-center px-4 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                            <th className="px-4 py-3.5" />
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.map((p, i) => (
                            <tr key={p.id} className={`border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors ${i === productosFiltrados.length - 1 ? 'border-0' : ''}`}>
                                <td className="px-5 py-3.5 font-semibold text-slate-200">{p.nombre}</td>
                                <td className="px-4 py-3.5">
                                    <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-700">
                                        {p.categoria.nombre}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono text-slate-300">${Number(p.precioComida).toFixed(2)}</td>
                                <td className="px-4 py-3.5 text-right font-mono text-slate-300">${Number(p.precioDesayuno).toFixed(2)}</td>
                                <td className="px-4 py-3.5 text-center">
                                    {p.disponibilidad
                                        ? <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold"><CheckCircle2 size={13} /> Activo</span>
                                        : <span className="inline-flex items-center gap-1 text-slate-500 text-xs font-bold"><XCircle size={13} /> Inactivo</span>
                                    }
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setDialog(p)}
                                            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center transition-colors"
                                        >
                                            <Pencil size={13} className="text-slate-400" />
                                        </button>
                                        <button
                                            onClick={() => setProductoAEliminar(p)}
                                            className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center transition-colors"
                                        >
                                            <Trash2 size={13} className="text-red-400" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {productosFiltrados.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-600">
                        <ChefHat size={36} className="mb-3 opacity-30" />
                        <p className="font-semibold">No hay platillos en esta categoría</p>
                    </div>
                )}
            </div>

            {/* Dialog crear/editar */}
            {dialog && (
                <FormPlatilloDialog
                    producto={dialog === 'nuevo' ? null : dialog}
                    categorias={categorias}
                    onGuardar={dialog === 'nuevo' ? handleCrear : handleEditar}
                    onCerrar={() => setDialog(null)}
                />
            )}

            {/* Confirmación de eliminar */}
            <AlertDialog open={!!productoAEliminar} onOpenChange={(v) => { if (!v) setProductoAEliminar(null); }}>
                <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">¿Eliminar "{productoAEliminar?.nombre}"?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-slate-700 text-slate-300 hover:text-white bg-transparent hover:bg-slate-800">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleBorrar}
                            className="bg-red-500 hover:bg-red-600 text-white border-transparent"
                        >
                            Sí, eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default DevPanel;
