import React from 'react';
import { toast } from 'sonner';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ordenService } from '@/services/ordenService';
import { useTiempos } from '@/hooks/useTiempos';
import MesaDialogHeader from './MesaDialogHeader';
import MesaMenu from './MesaMenu';
import MesaOrden from './MesaOrden';
import { TEMAS_MESA } from './constants';
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

const MesaDialogContent = ({ mesa, productos, turno, carrito, setCarrito, idOrden, numeroComanda, onOrdenCerrada, onOrdenCancelada, onAgregar, onCambiarCantidad, onEliminarItem, onCambiarComentario, onOrdenModificada, total, precioSegunTurno }) => {
    const { getUsuarioId } = useAuth();
    const tema = TEMAS_MESA[turno];
    const { tiempos, cambiarCantidad: cambiarCantidadTiempo } = useTiempos(idOrden);

    const categorias = React.useMemo(
        () => [...new Set(productos.map(p => p.categoria.nombre))],
        [productos]
    );

    const [categoriaActiva, setCategoriaActiva] = React.useState("");
    const [busqueda, setBusqueda] = React.useState("");
    // Vista activa en orientación vertical: 'menu' | 'orden' (en horizontal se muestran ambas)
    const [vista, setVista] = React.useState("menu");
    const [confirmandoCancelar, setConfirmandoCancelar] = React.useState(false);

    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    React.useEffect(() => {
        if (categorias.length > 0 && !categoriaActiva) {
            setCategoriaActiva(categorias[0]);
        }
    }, [categorias, categoriaActiva]);

    const productosFiltrados = productos.filter(p => {
        if (!p.disponibilidad) return false;
        if (precioSegunTurno(p) <= 0) return false;
        if (busqueda.trim())
            return p.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return p.categoria.nombre === categoriaActiva;
    });

    const construirPayload = () => ({
        id_usuario: getUsuarioId(),
        id_orden: idOrden,
        servicio: turno === "comida" ? "COMIDA" : "DESAYUNO",
        platillos: carrito.map(({ id_detalle, id_producto, cantidad, comentarios }) => ({
            id_detalle,
            id_producto,
            cantidad,
            comentarios,
        })),
    });

    const handleActualizar = async () => {
        try {
            const respuesta = await ordenService.guardarDetalle(construirPayload());
            setCarrito(prev => prev.map(item => {
                const detalle = respuesta.platillos?.find(p => p.id_producto === item.id_producto);
                return detalle ? { ...item, id_detalle: detalle.id_detalle } : item;
            }));
            onOrdenModificada?.();
            toast.success(idOrden ? "Orden modificada" : "Orden enviada");
        } catch (error) {
            toast.error("Error al guardar la orden");
            throw error;
        }
    };

    const handleCerrar = () => {
        onOrdenCerrada();
    };

    const handleCancelar = () => {
        setConfirmandoCancelar(true);
    };

    const handleReenviarCocina = async () => {
        try {
            await ordenService.reenviarACocina(idOrden);
            toast.success("Orden reenviada a cocina");
        } catch {
            toast.error("Error al reenviar a cocina");
        }
    };

    return (
        <div className="flex flex-col h-full min-h-0">
            <MesaDialogHeader mesa={mesa} tema={tema} numeroComanda={numeroComanda} />

            {/* Vertical: una vista a la vez ('menu' | 'orden'). Horizontal: dos columnas */}
            <div className="flex flex-col landscape:grid landscape:grid-cols-[1.5fr_1fr] gap-4 landscape:gap-6 pt-4 landscape:pt-6 flex-1 min-h-0">
                <div className={`min-h-0 flex-1 ${vista === "menu" ? "flex flex-col" : "hidden"} landscape:flex landscape:flex-col`}>
                    <MesaMenu
                        productosFiltrados={productosFiltrados}
                        categorias={categorias}
                        categoriaActiva={categoriaActiva}
                        setCategoriaActiva={setCategoriaActiva}
                        busqueda={busqueda}
                        setBusqueda={setBusqueda}
                        onAgregar={onAgregar}
                        precioSegunTurno={precioSegunTurno}
                        tema={tema}
                    />
                </div>
                <div className={`min-h-0 flex-1 ${vista === "orden" ? "flex flex-col" : "hidden"} landscape:flex landscape:flex-col`}>
                    <MesaOrden
                        carrito={carrito}
                        total={total}
                        tema={tema}
                        tieneOrden={idOrden !== null}
                        onCambiarCantidad={onCambiarCantidad}
                        onEliminar={onEliminarItem}
                        onCambiarComentario={onCambiarComentario}
                        onActualizar={handleActualizar}
                        onCerrar={handleCerrar}
                        onCancelar={handleCancelar}
                        onReenviarCocina={handleReenviarCocina}
                        tiempos={tiempos}
                        onCambiarCantidadTiempo={cambiarCantidadTiempo}
                    />
                </div>
            </div>

            {/* Barra inferior — solo en vertical: alterna entre menú y orden */}
            <div className="landscape:hidden pt-3 shrink-0">
                {vista === "menu" ? (
                    <button
                        onClick={() => setVista("orden")}
                        className={`w-full px-4 py-4 rounded-xl ${tema.bg} ${tema.bgHover} active:scale-[0.98] text-slate-950 font-bold text-base transition-all flex items-center justify-center gap-3`}
                    >
                        <span className="relative">
                            <ShoppingCart size={20} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-slate-950 text-white text-[11px] font-black flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </span>
                        <span>Ver orden</span>
                        <span className="font-black">${total.toFixed(2)}</span>
                    </button>
                ) : (
                    <button
                        onClick={() => setVista("menu")}
                        className="w-full px-4 py-4 rounded-xl border border-slate-700 hover:bg-slate-800 active:bg-slate-700 text-slate-300 font-bold text-base transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Volver al menú
                    </button>
                )}
            </div>

            {/* Confirmación de cancelar mesa */}
            <AlertDialog open={confirmandoCancelar} onOpenChange={setConfirmandoCancelar}>
                <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">¿Cancelar la Mesa {mesa.numero}?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Se liberará sin generar ticket.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-slate-700 text-slate-300 hover:text-white bg-transparent hover:bg-slate-800">
                            Volver
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => { setConfirmandoCancelar(false); onOrdenCancelada(); }}
                            className="bg-red-500 hover:bg-red-600 text-white border-transparent"
                        >
                            Sí, cancelar mesa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default MesaDialogContent;
