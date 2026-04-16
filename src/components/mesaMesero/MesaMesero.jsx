import React from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/hooks/useAuth';
import { mesaService } from '@/services/mesaService';
import MesaDialogContent from './MesaDialogContent';
import MesaAbrirOrden from './MesaAbrirOrden';
import MesaCard from './MesaCard';
import { useMesaCart } from '@/hooks/useMesaCart';

const CACHE_TTL = 30_000; // 30 segundos

const MesaMesero = ({ mesa, productos, idOrden, onOrdenCreada, onOrdenCerrada }) => {
    const { getUsuarioId } = useAuth();
    const [open, setOpen] = React.useState(false);
    const [turno, setTurno] = React.useState("comida");
    const [cargando, setCargando] = React.useState(false);
    const [numeroComanda, setNumeroComanda] = React.useState(null);

    // Caché por instancia de mesa — se invalida cuando cambia idOrden
    const cacheOrden = React.useRef({ timestamp: 0, data: null });
    React.useEffect(() => {
        cacheOrden.current = { timestamp: 0, data: null };
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
        guardarCarrito
    } = useMesaCart(idOrden, turno);

    const aplicarRespuestaOrden = (resp) => {
        if (resp?.id_orden) {
            const serverCarrito = resp.platillos.map(p => ({
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
        if (tienePendientes && !window.confirm('Cambiar turno eliminará los productos no enviados. ¿Continuar?')) return;
        limpiarCarrito();
        setTurno(nuevoTurno);
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

            <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] h-[90vh] max-h-[90vh] bg-[#0f172a] border-slate-800 text-slate-100 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col">
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
                        onAgregar={agregarAlCarrito}
                        onCambiarCantidad={cambiarCantidad}
                        onEliminarItem={eliminarItem}
                        onCambiarComentario={cambiarComentario}
                        total={total}
                        precioSegunTurno={precioSegunTurno}
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
            </DialogContent>
        </Dialog>
    );
};

export default MesaMesero;
