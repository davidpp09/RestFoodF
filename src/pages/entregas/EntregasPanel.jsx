import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { ShoppingBag, PackagePlus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useProductos } from '@/hooks/useProductos';
import { useMesaCart } from '@/hooks/useMesaCart';
import { ordenService } from '@/services/ordenService';
import { TEMAS_MESA } from '@/components/mesaMesero/constants';
import MesaMenu from '@/components/mesaMesero/MesaMenu';
import MesaOrden from '@/components/mesaMesero/MesaOrden';

// ── Selector de turno + botón iniciar ─────────────────────────────────────
const TurnoSelector = ({ turno, onCambiarTurno, onAbrir, cargando }) => (
    <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-sm shadow-2xl flex flex-col gap-6">
            <div className="text-center">
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag size={28} className="text-orange-500" />
                </div>
                <p className="text-xl font-black text-white">Nueva Entrega</p>
                <p className="text-xs text-slate-500 mt-1">Selecciona el turno</p>
            </div>

            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1 gap-1">
                <button
                    onClick={() => onCambiarTurno('desayuno')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all
                        ${turno === 'desayuno' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Desayuno
                </button>
                <button
                    onClick={() => onCambiarTurno('comida')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all
                        ${turno === 'comida' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Comida
                </button>
            </div>

            <button
                onClick={onAbrir}
                disabled={cargando}
                className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-black text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {cargando
                    ? <><Loader2 size={16} className="animate-spin" /> Abriendo...</>
                    : <><PackagePlus size={16} /> Iniciar Orden</>}
            </button>
        </div>
    </div>
);

// ── Panel principal ────────────────────────────────────────────────────────
const EntregasPanel = () => {
    const { getUsuarioId } = useAuth();
    const { productos, cargando: cargandoProductos } = useProductos();

    const [open, setOpen] = useState(false);
    const [turno, setTurno] = useState('comida');
    const [idOrden, setIdOrden] = useState(null);
    const [numeroComanda, setNumeroComanda] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [categoriaActiva, setCategoriaActiva] = useState('');
    const [busqueda, setBusqueda] = useState('');

    const tema = TEMAS_MESA[turno];
    const categorias = useMemo(() => [...new Set(productos.map(p => p.categoria.nombre))], [productos]);

    useEffect(() => {
        if (categorias.length > 0 && !categoriaActiva) setCategoriaActiva(categorias[0]);
    }, [categorias, categoriaActiva]);

    const {
        carrito, setCarrito, limpiarCarrito,
        agregarAlCarrito, cambiarCantidad, eliminarItem, cambiarComentario,
        total, precioSegunTurno, guardarCarrito,
    } = useMesaCart(idOrden, turno);

    const abrirOrden = async () => {
        setCargando(true);
        try {
            const { id_orden, numero_comanda } = await ordenService.abrirOrdenSinMesa({
                id_usuario: getUsuarioId(),
                servicio: turno === 'comida' ? 'COMIDA' : 'DESAYUNO',
            });
            setIdOrden(id_orden);
            setNumeroComanda(numero_comanda);
            toast.success('Orden para llevar iniciada');
        } catch {
            toast.error('Error al abrir la orden');
        } finally {
            setCargando(false);
        }
    };

    // Envía a cocina y cierra el dialog — sin ticket para el repartidor
    const handleEnviarACocina = async () => {
        try {
            await ordenService.guardarDetalle({
                id_usuario: getUsuarioId(),
                id_orden: idOrden,
                servicio: turno === 'comida' ? 'COMIDA' : 'DESAYUNO',
                platillos: carrito.map(({ id_detalle, id_producto, cantidad, comentarios }) => ({
                    id_detalle, id_producto, cantidad, comentarios,
                })),
            });
            // Resetear todo y cerrar dialog
            setIdOrden(null);
            setNumeroComanda(null);
            limpiarCarrito(false);
            setOpen(false);
            toast.success('Orden enviada a cocina');
        } catch {
            toast.error('Error al enviar la orden');
        }
    };

    const handleCambiarTurno = (nuevoTurno) => {
        if (nuevoTurno === turno) return;
        limpiarCarrito();
        setTurno(nuevoTurno);
    };

    return (
        <div className="space-y-6">
            {/* Header del panel */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Área de Entrega</h1>
                    <p className="text-slate-400">Gestiona los pedidos para llevar</p>
                </div>
                <button
                    onClick={() => setOpen(true)}
                    disabled={cargandoProductos}
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                >
                    <PackagePlus size={20} />
                    Nueva Entrega
                </button>
            </div>

            {/* Dialog de orden */}
            <Dialog open={open} onOpenChange={(v) => { if (!v) { setOpen(false); } }}>
                <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] h-[90vh] max-h-[90vh] bg-[#0f172a] border-slate-800 text-slate-100 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col">

                    {/* Header del dialog */}
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-800 shrink-0">
                        <div className={`p-2 rounded-lg ${tema.bgTenue}`}>
                            <ShoppingBag size={22} className={tema.text} />
                        </div>
                        <div>
                            <p className="text-xl font-black text-white">Para Llevar</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {idOrden ? `Comanda #${numeroComanda} en curso` : 'Sin orden activa'}
                            </p>
                        </div>
                    </div>

                    {/* Contenido: menú + carrito */}
                    <div className={`grid grid-cols-[1.5fr_1fr] gap-6 pt-4 flex-1 min-h-0 transition-all duration-300 ${!idOrden ? 'blur-sm opacity-30 pointer-events-none select-none' : ''}`}>
                        <MesaMenu
                            productosFiltrados={productos.filter(p => {
                                if (!p.disponibilidad || precioSegunTurno(p) <= 0) return false;
                                if (busqueda.trim()) return p.nombre.toLowerCase().includes(busqueda.toLowerCase());
                                return p.categoria.nombre === categoriaActiva;
                            })}
                            categorias={categorias}
                            categoriaActiva={categoriaActiva}
                            setCategoriaActiva={setCategoriaActiva}
                            busqueda={busqueda}
                            setBusqueda={setBusqueda}
                            onAgregar={agregarAlCarrito}
                            precioSegunTurno={precioSegunTurno}
                            tema={tema}
                        />
                        <MesaOrden
                            carrito={carrito}
                            total={total}
                            tema={tema}
                            tieneOrden={!!idOrden}
                            onCambiarCantidad={cambiarCantidad}
                            onEliminar={eliminarItem}
                            onCambiarComentario={cambiarComentario}
                            onActualizar={handleEnviarACocina}
                            labelEnviar="Enviar a Cocina"
                            mostrarCerrar={false}
                        />
                    </div>

                    {/* Overlay selector de turno cuando no hay orden */}
                    {!idOrden && (
                        <TurnoSelector
                            turno={turno}
                            onCambiarTurno={handleCambiarTurno}
                            onAbrir={abrirOrden}
                            cargando={cargando}
                        />
                    )}
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default EntregasPanel;
