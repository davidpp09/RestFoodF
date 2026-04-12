import React from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UtensilsCrossed } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { mesaService } from '@/services/mesaService';
import MesaDialogContent from './MesaDialogContent';
import MesaAbrirOrden from './MesaAbrirOrden';

const carritoKey     = (idOrden) => `carrito_${idOrden}`;
const guardarCarrito = (idOrden, carrito) => {
    if (!idOrden) return;
    localStorage.setItem(carritoKey(idOrden), JSON.stringify(carrito));
};
const cargarCarrito  = (idOrden) => {
    if (!idOrden) return [];
    try { return JSON.parse(localStorage.getItem(carritoKey(idOrden))) ?? []; }
    catch { return []; }
};

const MesaMesero = ({ mesa, productos, idOrden, onOrdenCreada, onOrdenCerrada }) => {
    const esOcupada        = mesa.estado === "OCUPADA";
    const { getUsuarioId } = useAuth();

    const [open, setOpen]         = React.useState(false);
    const [turno, setTurno]       = React.useState("comida");
    const [carrito, setCarrito]   = React.useState(() => cargarCarrito(idOrden));
    const [cargando, setCargando] = React.useState(false);

    // Cuando idOrden llega o cambia, carga el carrito guardado
    React.useEffect(() => {
        setCarrito(cargarCarrito(idOrden));
    }, [idOrden]);

    // Guarda carrito en localStorage cuando cambia
    React.useEffect(() => {
        guardarCarrito(idOrden, carrito);
    }, [carrito, idOrden]);

    // Cada vez que se abre el dialog sin orden conocida → pregunta al back
    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (isOpen && !idOrden) {
            mesaService.obtenerOrdenActiva(mesa.id ?? mesa.id_mesa)
                .then(resp => {
                    if (resp?.id_orden) {
                        // Map backend platillos to frontend carrito format
                        const initialCarrito = resp.platillos.map(p => ({
                            id_detalle: p.id_detalle,
                            id: p.id_producto,
                            id_producto: p.id_producto,
                            nombre: p.nombre_producto,
                            precio: p.precio_unitario,
                            cantidad: p.cantidad,
                            comentarios: p.comentarios || "",
                        }));
                        
                        // Sincronizamos con localStorage para que no se pierda al recargar
                        guardarCarrito(resp.id_orden, initialCarrito);
                        
                        // Notificamos al padre y actualizamos localmente
                        onOrdenCreada(resp.id_orden);
                        setCarrito(initialCarrito);
                    }
                })
                .catch(() => {});  // 404 = sin orden activa, mostrar pantalla de abrir
        }
    };

    const cambiarTurno = (nuevoTurno) => {
        if (nuevoTurno === turno) return;
        if (carrito.length > 0) toast.info("Se limpió el carrito al cambiar de turno");
        setCarrito([]);
        setTurno(nuevoTurno);
    };

    const abrirOrden = async (tipo) => {
        setCargando(true);
        try {
            const idNueva = await mesaService.abrirMesa({
                id_mesa:    mesa.id ?? mesa.id_mesa,
                id_usuario: getUsuarioId(),
                tipo,
                servicio:   turno === "comida" ? "COMIDA" : "DESAYUNO",
            });
            onOrdenCreada(idNueva);
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
                <div className={`
                    cursor-pointer p-4 rounded-2xl border transition-all duration-300 h-32
                    flex flex-col justify-between active:scale-95
                    ${esOcupada || idOrden
                        ? "bg-[#0f172a] border-red-500/40 shadow-lg shadow-red-900/10"
                        : "bg-[#0f172a]/40 border-slate-800/60 shadow-inner"}
                `}>
                    <div className="flex justify-between items-center">
                        <span className={`text-sm font-black px-2.5 py-1 rounded-lg tracking-tighter
                            ${esOcupada || idOrden ? "bg-red-500/10 text-red-500" : "bg-slate-800 text-slate-400"}`}>
                            #{mesa.numero}
                        </span>
                        <div className={`w-2.5 h-2.5 rounded-full ${esOcupada || idOrden
                            ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse"
                            : "bg-slate-700"}`}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        {idOrden ? (
                            <div className="flex items-center gap-2 text-slate-500 font-mono">
                                <UtensilsCrossed size={11} />
                                <span className="text-[9px]">ORD #{idOrden}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-slate-600">
                                <UtensilsCrossed size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                    {esOcupada ? "Ocupada" : "Libre"}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] h-[90vh] max-h-[90vh] bg-[#0f172a] border-slate-800 text-slate-100 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col">
                <div className={`flex flex-col h-full min-h-0 transition-all duration-300 ${!idOrden ? "blur-sm opacity-30 pointer-events-none select-none" : ""}`}>
                    <MesaDialogContent
                        mesa={mesa}
                        productos={productos}
                        turno={turno}
                        onCambiarTurno={cambiarTurno}
                        carrito={carrito}
                        setCarrito={setCarrito}
                        idOrden={idOrden}
                        onOrdenCerrada={() => {
                            setOpen(false);
                            onOrdenCerrada();
                        }}
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
