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

    if (cargando) return <div className="text-rf-text-2">Cargando platillos...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-rf-accent-soft p-3 rounded-md border border-rf-accent-border">
                        <ChefHat size={22} className="text-rf-accent-ink" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-rf-text">Platillos</h1>
                        <p className="text-rf-text-2 text-sm">{productos.length} platillos registrados</p>
                    </div>
                </div>
                <button
                    onClick={() => setDialog('nuevo')}
                    className="inline-flex items-center gap-2 bg-rf-accent hover:bg-rf-accent-strong text-white font-bold px-4 py-2.5 rounded-md transition-colors text-sm"
                >
                    <Plus size={18} /> Nuevo Platillo
                </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rf-text-3 pointer-events-none" />
                <input
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    placeholder="Buscar platillo..."
                    className="w-full bg-rf-surface border border-rf-border-strong rounded-md pl-10 pr-4 py-2.5 text-sm text-rf-text placeholder:text-rf-text-3 outline-none focus:border-rf-accent transition-colors"
                />
                {busqueda && (
                    <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-rf-text-3 hover:text-rf-text transition-colors">
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Filtro por categoría */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setFiltroCat('')}
                    className={`px-3 py-1.5 rounded-[3px] text-xs font-bold transition-colors border ${!filtroCat ? 'bg-rf-accent border-rf-accent text-white' : 'bg-rf-surface border-rf-border-strong text-rf-text-2 hover:text-rf-text'}`}
                >
                    Todos
                </button>
                {categorias.map(c => (
                    <button
                        key={c.id}
                        onClick={() => setFiltroCat(c.nombre)}
                        className={`px-3 py-1.5 rounded-[3px] text-xs font-bold transition-colors border ${filtroCat === c.nombre ? 'bg-rf-accent border-rf-accent text-white' : 'bg-rf-surface border-rf-border-strong text-rf-text-2 hover:text-rf-text'}`}
                    >
                        {c.nombre}
                    </button>
                ))}
            </div>

            {/* Tabla */}
            <div className="bg-rf-surface border border-rf-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-rf-border bg-rf-surface-2">
                            <th className="text-left px-5 py-3.5 text-xs font-bold text-rf-text-3 uppercase tracking-widest">Platillo</th>
                            <th className="text-left px-4 py-3.5 text-xs font-bold text-rf-text-3 uppercase tracking-widest">Categoría</th>
                            <th className="text-right px-4 py-3.5 text-xs font-bold text-rf-text-3 uppercase tracking-widest">Comida</th>
                            <th className="text-right px-4 py-3.5 text-xs font-bold text-rf-text-3 uppercase tracking-widest">Desayuno</th>
                            <th className="text-center px-4 py-3.5 text-xs font-bold text-rf-text-3 uppercase tracking-widest">Estado</th>
                            <th className="px-4 py-3.5" />
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.map((p, i) => (
                            <tr key={p.id} className={`border-b border-rf-border hover:bg-rf-surface-2/60 transition-colors ${i === productosFiltrados.length - 1 ? 'border-0' : ''}`}>
                                <td className="px-5 py-3.5 font-semibold text-rf-text">{p.nombre}</td>
                                <td className="px-4 py-3.5">
                                    <span className="bg-rf-surface-2 text-rf-text-2 px-2.5 py-1 rounded-[3px] text-xs font-bold border border-rf-border">
                                        {p.categoria.nombre}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono text-rf-text-2">${Number(p.precioComida).toFixed(0)}</td>
                                <td className="px-4 py-3.5 text-right font-mono text-rf-text-2">${Number(p.precioDesayuno).toFixed(0)}</td>
                                <td className="px-4 py-3.5 text-center">
                                    {p.disponibilidad
                                        ? <span className="inline-flex items-center gap-1 text-rf-green-ink text-xs font-bold"><CheckCircle2 size={13} /> Activo</span>
                                        : <span className="inline-flex items-center gap-1 text-rf-text-3 text-xs font-bold"><XCircle size={13} /> Inactivo</span>
                                    }
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setDialog(p)}
                                            className="w-8 h-8 rounded-lg bg-rf-surface-2 hover:bg-rf-border border border-rf-border-strong flex items-center justify-center transition-colors"
                                        >
                                            <Pencil size={13} className="text-rf-text-2" />
                                        </button>
                                        <button
                                            onClick={() => setProductoAEliminar(p)}
                                            className="w-8 h-8 rounded-lg bg-rf-red-soft hover:bg-rf-red-soft/70 border border-transparent flex items-center justify-center transition-colors"
                                        >
                                            <Trash2 size={13} className="text-rf-red-ink" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {productosFiltrados.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-rf-text-3">
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
                <AlertDialogContent className="bg-rf-surface border-rf-border text-rf-text">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-rf-text">¿Eliminar "{productoAEliminar?.nombre}"?</AlertDialogTitle>
                        <AlertDialogDescription className="text-rf-text-2">
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-rf-border-strong text-rf-text-2 hover:text-rf-text bg-transparent hover:bg-rf-surface-2">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleBorrar}
                            className="bg-rf-red hover:bg-rf-red/90 text-white border-transparent"
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
