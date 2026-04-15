import React from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { ordenService } from '@/services/ordenService';
import MesaDialogHeader from './MesaDialogHeader';
import MesaMenu from './MesaMenu';
import MesaOrden from './MesaOrden';
import { TEMAS_MESA } from './constants';

const MesaDialogContent = ({ mesa, productos, turno, carrito, setCarrito, idOrden, numeroComanda, onOrdenCerrada, onAgregar, onCambiarCantidad, onEliminarItem, onCambiarComentario, total, precioSegunTurno }) => {
    const { getUsuarioId } = useAuth();
    const tema = TEMAS_MESA[turno];

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
            toast.success(idOrden ? "Orden modificada" : "Orden enviada");
        } catch (error) {
            toast.error("Error al guardar la orden");
            throw error;
        }
    };

    const handleCerrar = () => {
        onOrdenCerrada();
    };

    return (
        <div className="flex flex-col h-full min-h-0">
            <MesaDialogHeader mesa={mesa} tema={tema} numeroComanda={numeroComanda} />

            <div className="grid grid-cols-[1.5fr_1fr] gap-6 pt-6 flex-1 min-h-0">
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
                />
            </div>
        </div>
    );
};

export default MesaDialogContent;
