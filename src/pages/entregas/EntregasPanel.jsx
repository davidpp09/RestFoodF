import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { ShoppingBag, PackagePlus, Loader2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useProductos } from '@/hooks/useProductos';
import { useMesaCart } from '@/hooks/useMesaCart';
import { useTiempos } from '@/hooks/useTiempos';
import { ordenService } from '@/services/ordenService';
import { TEMAS_MESA } from '@/components/mesaMesero/constants';
import MesaMenu from '@/components/mesaMesero/MesaMenu';
import MesaOrden from '@/components/mesaMesero/MesaOrden';

// ── Selector de turno + botón iniciar ─────────────────────────────────────
const TurnoSelector = ({ turno, onCambiarTurno, onAbrir, cargando }) => (
    /* pointer-events-none en el wrapper para no tapar el botón X de cerrar el dialog */
    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="pointer-events-auto bg-rf-surface border border-rf-border rounded-lg p-8 w-full max-w-sm shadow-2xl flex flex-col gap-6">
            <div className="text-center">
                <div className="w-14 h-14 bg-rf-accent-soft rounded-md flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag size={28} className="text-rf-accent-ink" />
                </div>
                <p className="text-xl font-bold text-rf-text">Nueva Entrega</p>
                <p className="text-xs text-rf-text-3 mt-1">Selecciona el turno</p>
            </div>

            <div className="flex items-center bg-rf-surface-2 border border-rf-border rounded-md p-1 gap-1">
                <button
                    onClick={() => onCambiarTurno('desayuno')}
                    className={`flex-1 py-3 rounded-lg text-base font-bold transition-all active:scale-95
                        ${turno === 'desayuno' ? 'bg-rf-accent text-white' : 'text-rf-text-3 hover:text-rf-text-2'}`}
                >
                    Desayuno
                </button>
                <button
                    onClick={() => onCambiarTurno('comida')}
                    className={`flex-1 py-3 rounded-lg text-base font-bold transition-all active:scale-95
                        ${turno === 'comida' ? 'bg-rf-cyan text-white' : 'text-rf-text-3 hover:text-rf-text-2'}`}
                >
                    Comida
                </button>
            </div>

            <button
                onClick={onAbrir}
                disabled={cargando}
                className="w-full py-3.5 rounded-md bg-rf-turno hover:bg-rf-turno-strong text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
    // Vista activa en orientación vertical: 'menu' | 'orden' (en horizontal se muestran ambas)
    const [vista, setVista] = useState('menu');

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

    // Tiempos de la orden para llevar — al enviar se imprimen en la impresora
    // de repartidores como talón aparte
    const { tiempos, cambiarCantidad: cambiarCantidadTiempo, limpiar: limpiarTiempos } = useTiempos(idOrden);

    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

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
        // Tiempos marcados → el backend imprime el talón en la impresora de repartidores
        const tiemposPlanos = {
            consome:    tiempos.tiempo1.consome,
            sopa_crema: tiempos.tiempo1.sopa_crema,
            arroz:      tiempos.tiempo2.arroz,
            espaguetti: tiempos.tiempo2.espaguetti,
        };
        const hayTiempos = Object.values(tiemposPlanos).some(v => v > 0);
        try {
            await ordenService.guardarDetalle({
                id_usuario: getUsuarioId(),
                id_orden: idOrden,
                servicio: turno === 'comida' ? 'COMIDA' : 'DESAYUNO',
                platillos: carrito.map(({ id_detalle, id_producto, cantidad, comentarios }) => ({
                    id_detalle, id_producto, cantidad, comentarios,
                })),
                tiempos: hayTiempos ? tiemposPlanos : null,
            });
            // Resetear todo y cerrar dialog
            limpiarTiempos(idOrden);
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
                    <h1 className="text-2xl font-bold text-rf-text">Área de Entrega</h1>
                    <p className="text-rf-text-2">Gestiona los pedidos para llevar</p>
                </div>
                <button
                    onClick={() => setOpen(true)}
                    disabled={cargandoProductos}
                    className="inline-flex items-center gap-2 bg-rf-accent hover:bg-rf-accent-strong active:scale-95 disabled:opacity-50 text-white px-6 py-3.5 rounded-md transition-all font-bold text-base"
                >
                    <PackagePlus size={22} />
                    Nueva Entrega
                </button>
            </div>

            {/* Dialog de orden */}
            <Dialog open={open} onOpenChange={(v) => { if (!v) { setOpen(false); setVista('menu'); } }}>
                <DialogContent data-turno={turno} className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] h-[90vh] max-h-[90vh] portrait:w-[100dvw] portrait:max-w-[100dvw] portrait:h-[100dvh] portrait:max-h-[100dvh] portrait:rounded-none bg-rf-bg border-rf-border text-rf-text rounded-lg shadow-rf-lg p-6 portrait:p-4 overflow-hidden flex flex-col">

                    {/* Header del dialog */}
                    <div className="flex items-center gap-3 pb-4 border-b border-rf-border shrink-0">
                        <div className={`p-2 rounded-lg ${tema.bgTenue}`}>
                            <ShoppingBag size={22} className={tema.text} />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-rf-text">Para Llevar</p>
                            <p className="text-xs text-rf-text-3 mt-0.5">
                                {idOrden ? `Comanda #${numeroComanda} en curso` : 'Sin orden activa'}
                            </p>
                        </div>
                    </div>

                    {/* Contenido: menú + carrito.
                        Vertical: una vista a la vez ('menu' | 'orden'). Horizontal: dos columnas */}
                    <div className={`flex flex-col flex-1 min-h-0 transition-all duration-300 ${!idOrden ? 'blur-sm opacity-30 pointer-events-none select-none' : ''}`}>
                        <div className="flex flex-col landscape:grid landscape:grid-cols-[1.5fr_1fr] gap-4 landscape:gap-6 pt-4 flex-1 min-h-0">
                            <div className={`min-h-0 flex-1 ${vista === 'menu' ? 'flex flex-col' : 'hidden'} landscape:flex landscape:flex-col`}>
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
                            </div>
                            <div className={`min-h-0 flex-1 ${vista === 'orden' ? 'flex flex-col' : 'hidden'} landscape:flex landscape:flex-col`}>
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
                                    tiempos={tiempos}
                                    onCambiarCantidadTiempo={cambiarCantidadTiempo}
                                />
                            </div>
                        </div>

                        {/* Barra inferior — solo en vertical: alterna entre menú y orden */}
                        <div className="landscape:hidden pt-3 shrink-0">
                            {vista === 'menu' ? (
                                <button
                                    onClick={() => setVista('orden')}
                                    className={`w-full px-4 py-4 rounded-md ${tema.bg} ${tema.bgHover} active:scale-[0.98] text-white font-bold text-base transition-all flex items-center justify-center gap-3`}
                                >
                                    <span className="relative">
                                        <ShoppingCart size={20} />
                                        {totalItems > 0 && (
                                            <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-rf-turno-strong text-[11px] font-bold flex items-center justify-center">
                                                {totalItems}
                                            </span>
                                        )}
                                    </span>
                                    <span>Ver orden</span>
                                    <span className="font-bold">${total.toFixed(2)}</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => setVista('menu')}
                                    className="w-full px-4 py-4 rounded-md border border-rf-border-strong hover:bg-rf-surface-2 active:bg-rf-surface-2 text-rf-text font-bold text-base transition-colors flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={18} />
                                    Volver al menú
                                </button>
                            )}
                        </div>
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
