import React from 'react';
import { toast } from 'sonner';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ordenService } from '@/services/ordenService';
import { useTiempos } from '@/hooks/useTiempos';
import { normalizarTexto } from '@/lib/utils';
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

const MesaDialogContent = ({ mesa, productos, turno, carrito, setCarrito, idOrden, numeroComanda, onOrdenCerrada, onOrdenCancelada, onAgregar, onCambiarCantidad, onEliminarItem, onCambiarComentario, onOrdenModificada, onEnviado, total, precioSegunTurno, marcarSincronizado, coincideConEnviado }) => {
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

    const productosFiltrados = productos
        .filter(p => p.disponibilidad && precioSegunTurno(p) > 0)
        .filter(p => busqueda.trim()
            ? normalizarTexto(p.nombre).includes(normalizarTexto(busqueda))
            : p.categoria.nombre === categoriaActiva)
        .sort((a, b) => {
            if (!busqueda.trim()) return 0;
            const query = normalizarTexto(busqueda);
            const aEmpieza = normalizarTexto(a.nombre).startsWith(query);
            const bEmpieza = normalizarTexto(b.nombre).startsWith(query);
            return aEmpieza === bEmpieza ? 0 : aEmpieza ? -1 : 1;
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
        // Antes de guardar: si nada tenía id_detalle, es el primer envío a cocina
        const eraPrimerEnvio = !carrito.some(item => item.id_detalle);
        try {
            const respuesta = await ordenService.guardarDetalle(construirPayload());
            setCarrito(prev => prev.map(item => {
                const detalle = respuesta.platillos?.find(p => p.id_producto === item.id_producto);
                return detalle ? { ...item, id_detalle: detalle.id_detalle } : item;
            }));
            // El servidor confirmó este estado — es la nueva foto de "lo enviado"
            marcarSincronizado?.(idOrden, respuesta.platillos ?? []);
            onOrdenModificada?.();
            toast.success(eraPrimerEnvio ? "Orden enviada a cocina" : "Orden modificada");
            // Al enviar, el dialog se cierra solo — la mesera vuelve al mapa de mesas
            onEnviado?.();
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
                        coincideConEnviado={coincideConEnviado}
                    />
                </div>
            </div>

            {/* Barra inferior — solo en vertical: alterna entre menú y orden */}
            <div className="landscape:hidden pt-3 shrink-0">
                {vista === "menu" ? (
                    <button
                        onClick={() => setVista("orden")}
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
                        onClick={() => setVista("menu")}
                        className="w-full px-4 py-4 rounded-md border border-rf-border-strong hover:bg-rf-surface-2 active:bg-rf-surface-2 text-rf-text font-bold text-base transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Volver al menú
                    </button>
                )}
            </div>

            {/* Confirmación de cancelar mesa */}
            <AlertDialog open={confirmandoCancelar} onOpenChange={setConfirmandoCancelar}>
                <AlertDialogContent className="bg-rf-surface border-rf-border text-rf-text">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-rf-text">¿Cancelar la Mesa {mesa.numero}?</AlertDialogTitle>
                        <AlertDialogDescription className="text-rf-text-2">
                            Se liberará sin generar ticket.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-rf-border-strong text-rf-text-2 hover:text-rf-text bg-transparent hover:bg-rf-surface-2">
                            Volver
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => { setConfirmandoCancelar(false); onOrdenCancelada(); }}
                            className="bg-rf-red hover:bg-rf-red/90 text-white border-transparent"
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
