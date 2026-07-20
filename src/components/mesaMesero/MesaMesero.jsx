import React from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/hooks/useAuth';
import { mesaService } from '@/services/mesaService';
import MesaDialogContent from './MesaDialogContent';
import MesaAbrirOrden from './MesaAbrirOrden';
import MesaCard from './MesaCard';
import { useMesaCart } from '@/hooks/useMesaCart';
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

const CACHE_TTL = 30_000; // 30 segundos

const MesaMesero = ({ mesa, productos, idOrden, onOrdenCreada, onOrdenCerrada, onOrdenCancelada }) => {
    const { getUsuarioId } = useAuth();
    const [open, setOpen] = React.useState(false);
    const [turno, setTurno] = React.useState("comida");
    const [cargando, setCargando] = React.useState(false);
    const [numeroComanda, setNumeroComanda] = React.useState(null);
    // Turno que espera confirmación porque hay productos sin enviar en el carrito
    const [turnoPendiente, setTurnoPendiente] = React.useState(null);

    // Caché por instancia de mesa — se invalida cuando cambia idOrden
    // o cuando se modifica la orden (si no, al reabrir en <30s se pintaría
    // el estado viejo del servidor pisando los cambios recién enviados)
    const cacheOrden = React.useRef({ timestamp: 0, data: null });
    const invalidarCacheOrden = () => {
        cacheOrden.current = { timestamp: 0, data: null };
    };
    React.useEffect(() => {
        invalidarCacheOrden();
    }, [idOrden]);

    const { 
        carrito, 
        setCarrito, 
        limpiarCarrito, 
        agregarAlCarrito, 
        cambiarCantidad, 
        eliminarItem, 
        cambiarComentario,
        total,
        precioSegunTurno,
        guardarCarrito,
        marcarSincronizado,
        coincideConEnviado,
        hayEnvioPrevio
    } = useMesaCart(idOrden, turno);

    const aplicarRespuestaOrden = (resp) => {
        if (resp?.id_orden) {
            // Sincronizar el turno con el servicio real de la orden para mostrar los precios correctos
            if (resp.servicio) {
                setTurno(resp.servicio === "DESAYUNO" ? "desayuno" : "comida");
            }
            const serverCarrito = (resp.platillos ?? []).map(p => ({
                id_detalle:  p.id_detalle,
                id:          p.id_producto,
                id_producto: p.id_producto,
                nombre:      p.nombre_producto,
                precio:      p.precio_unitario,
                cantidad:    p.cantidad,
                comentarios: p.comentarios || "",
            }));
            onOrdenCreada(resp.id_orden);
            if (resp.numero_comanda != null) setNumeroComanda(resp.numero_comanda);
            // Lo que responde el servidor ES el estado enviado — registrar la foto
            marcarSincronizado(resp.id_orden, serverCarrito);
            // Preservar items locales sin enviar (id_detalle: null) que no estén ya en el servidor
            setCarrito(prev => {
                const unsentLocal = prev.filter(
                    item => !item.id_detalle &&
                            !serverCarrito.find(s => s.id_producto === item.id_producto)
                );
                const merged = [...serverCarrito, ...unsentLocal];
                guardarCarrito(resp.id_orden, merged);
                return merged;
            });
        }
    };

    // Cada vez que se abre el dialog → consulta la orden activa (con caché de 30 s)
    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (!isOpen) return;

        const ahora = Date.now();
        if (ahora - cacheOrden.current.timestamp < CACHE_TTL && cacheOrden.current.data) {
            aplicarRespuestaOrden(cacheOrden.current.data);
            return;
        }

        const mesaId = mesa.id ?? mesa.id_mesa;
        mesaService.obtenerOrdenActiva(mesaId)
            .then(resp => {
                cacheOrden.current = { timestamp: Date.now(), data: resp };
                aplicarRespuestaOrden(resp);
            })
            .catch(() => {
                cacheOrden.current = { timestamp: 0, data: null };
            });
    };

    const cambiarTurno = (nuevoTurno) => {
        if (nuevoTurno === turno) return;
        const tienePendientes = carrito.some(item => !item.id_detalle);
        if (tienePendientes) {
            setTurnoPendiente(nuevoTurno);
            return;
        }
        limpiarCarrito();
        setTurno(nuevoTurno);
    };

    const confirmarCambioTurno = () => {
        limpiarCarrito();
        setTurno(turnoPendiente);
        setTurnoPendiente(null);
    };

    const abrirOrden = async (tipo) => {
        setCargando(true);
        try {
            const { id_orden, numero_comanda } = await mesaService.abrirMesa({
                id_mesa:    mesa.id ?? mesa.id_mesa,
                id_usuario: getUsuarioId(),
                tipo,
                servicio:   turno === "comida" ? "COMIDA" : "DESAYUNO",
            });
            onOrdenCreada(id_orden);
            setNumeroComanda(numero_comanda);
            toast.success("Orden abierta");
        } catch {
            toast.error("Error al abrir la orden");
        } finally {
            setCargando(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <MesaCard mesa={mesa} idOrden={idOrden} />
            </DialogTrigger>

            <DialogContent data-turno={turno} className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] h-[90vh] max-h-[90vh] portrait:w-[100dvw] portrait:max-w-[100dvw] portrait:h-[100dvh] portrait:max-h-[100dvh] portrait:rounded-none bg-rf-bg border-rf-border text-rf-text rounded-lg shadow-rf-lg p-6 portrait:p-4 overflow-hidden flex flex-col">
                <div className={`flex flex-col h-full min-h-0 transition-all duration-300 ${!idOrden ? "blur-sm opacity-30 pointer-events-none select-none" : ""}`}>
                    <MesaDialogContent
                        mesa={mesa}
                        productos={productos}
                        turno={turno}
                        carrito={carrito}
                        setCarrito={setCarrito}
                        idOrden={idOrden}
                        numeroComanda={numeroComanda}
                        onOrdenCerrada={() => {
                            setOpen(false);
                            onOrdenCerrada();
                        }}
                        onOrdenCancelada={() => {
                            setOpen(false);
                            onOrdenCancelada();
                        }}
                        onAgregar={agregarAlCarrito}
                        onCambiarCantidad={cambiarCantidad}
                        onEliminarItem={eliminarItem}
                        onCambiarComentario={cambiarComentario}
                        onOrdenModificada={invalidarCacheOrden}
                        onEnviado={() => setOpen(false)}
                        total={total}
                        precioSegunTurno={precioSegunTurno}
                        marcarSincronizado={marcarSincronizado}
                        coincideConEnviado={coincideConEnviado}
                        hayEnvioPrevio={hayEnvioPrevio}
                    />
                </div>

                {!idOrden && (
                    <MesaAbrirOrden
                        mesa={mesa}
                        turno={turno}
                        onCambiarTurno={cambiarTurno}
                        onAbrir={abrirOrden}
                        cargando={cargando}
                    />
                )}

                {/* Confirmación de cambio de turno con productos sin enviar */}
                <AlertDialog open={!!turnoPendiente} onOpenChange={(v) => { if (!v) setTurnoPendiente(null); }}>
                    <AlertDialogContent className="bg-rf-surface border-rf-border text-rf-text">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-rf-text">¿Cambiar turno?</AlertDialogTitle>
                            <AlertDialogDescription className="text-rf-text-2">
                                Se eliminarán los productos que aún no has enviado a cocina.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="border-rf-border-strong text-rf-text-2 hover:text-rf-text bg-transparent hover:bg-rf-surface-2">
                                Volver
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmarCambioTurno}
                                className="bg-rf-red hover:bg-rf-red/90 text-white border-transparent"
                            >
                                Sí, cambiar turno
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DialogContent>
        </Dialog>
    );
};

export default MesaMesero;
