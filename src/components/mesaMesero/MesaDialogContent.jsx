import React from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { ordenService } from '@/services/ordenService';
import MesaDialogHeader from './MesaDialogHeader';
import MesaMenu from './MesaMenu';
import MesaOrden from './MesaOrden';

const TEMAS = {
    comida: {
        bg: "bg-cyan-500",
        bgHover: "hover:bg-cyan-600",
        bgTenue: "bg-cyan-500/10",
        bgTenueHover: "hover:bg-cyan-500",
        text: "text-cyan-500",
        textHover: "hover:text-cyan-500",
        border: "hover:border-cyan-500/50",
        shadow: "shadow-cyan-900/30",
    },
    desayuno: {
        bg: "bg-amber-500",
        bgHover: "hover:bg-amber-600",
        bgTenue: "bg-amber-500/10",
        bgTenueHover: "hover:bg-amber-500",
        text: "text-amber-500",
        textHover: "hover:text-amber-500",
        border: "hover:border-amber-500/50",
        shadow: "shadow-amber-900/30",
    },
};

const MesaDialogContent = ({ mesa, productos, turno, onCambiarTurno, carrito, setCarrito, idOrden, onOrdenCerrada }) => {
    const { getUsuarioId } = useAuth();

    const tema = TEMAS[turno];

    // Categorías únicas tomadas directamente del back
    const categorias = React.useMemo(
        () => [...new Set(productos.map(p => p.categoria.nombre))],
        [productos]
    );

    const [categoriaActiva, setCategoriaActiva] = React.useState("");
    const [busqueda, setBusqueda] = React.useState("");

    React.useEffect(() => {
        if (categorias.length > 0 && !categoriaActiva) {
            setCategoriaActiva(categorias[0]);
        }
    }, [categorias]);

    // Precio según turno — Number() por si BigDecimal viene como string
    const precioSegunTurno = (producto) =>
        Number(turno === "comida" ? (producto.precioComida ?? 0) : (producto.precioDesayuno ?? 0));

    // Filtra: disponible + con precio en este turno + categoría o búsqueda
    const productosFiltrados = productos.filter(p => {
        if (!p.disponibilidad) return false;
        if (precioSegunTurno(p) <= 0) return false;
        if (busqueda.trim())
            return p.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return p.categoria.nombre === categoriaActiva;
    });

    /* ── Carrito helpers ─────────────────────────────────────────────── */
    const agregarAlCarrito = (producto) => {
        const precio = precioSegunTurno(producto);
        setCarrito(prev => {
            const existe = prev.find(item => item.id === producto.id);
            if (existe) {
                return prev.map(item =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [...prev, {
                id_detalle: null,
                id: producto.id,
                id_producto: producto.id,
                nombre: producto.nombre,
                precio,
                cantidad: 1,
                comentarios: "",
            }];
        });
    };

    const cambiarCantidad = (id, delta) => {
        setCarrito(prev =>
            prev
                .map(item => item.id === id ? { ...item, cantidad: item.cantidad + delta } : item)
                .filter(item => item.cantidad > 0)
        );
    };

    const eliminarItem = (id) => {
        setCarrito(prev => prev.filter(item => item.id !== id));
    };

    const cambiarComentario = (id, comentarios) => {
        setCarrito(prev =>
            prev.map(item => item.id === id ? { ...item, comentarios } : item)
        );
    };

    /* ── Payload ─────────────────────────────────────────────────────── */
    const construirPayload = () => ({
        id_usuario: getUsuarioId(),
        id_orden: idOrden,   // ya tiene el valor real desde MeseroPanel
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

            // Actualiza id_detalle en el carrito con los valores reales del back
            // Así la próxima modificación envía id_detalle correcto en lugar de null
            setCarrito(prev => prev.map(item => {
                const detalle = respuesta.platillos?.find(p => p.id_producto === item.id_producto);
                return detalle ? { ...item, id_detalle: detalle.id_detalle } : item;
            }));

            toast.success(idOrden ? "Orden modificada" : "Orden enviada");
        } catch {
            toast.error("Error al guardar la orden");
        }
    };

    /* ── Total (sin IVA) ─────────────────────────────────────────────── */
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    return (
        <div className="flex flex-col h-full min-h-0">
            <MesaDialogHeader mesa={mesa} tema={tema} />

            <div className="grid grid-cols-[1.5fr_1fr] gap-6 pt-6 flex-1 min-h-0">
                <MesaMenu
                    productosFiltrados={productosFiltrados}
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
                    tieneOrden={idOrden !== null}
                    onCambiarCantidad={cambiarCantidad}
                    onEliminar={eliminarItem}
                    onCambiarComentario={cambiarComentario}
                    onActualizar={handleActualizar}
                    onCerrar={onOrdenCerrada}
                />
            </div>
        </div>
    );
};

export default MesaDialogContent;
