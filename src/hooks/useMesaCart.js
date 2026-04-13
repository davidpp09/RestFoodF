import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const carritoKey = (idOrden) => `carrito_${idOrden}`;

const cargarCarrito = (idOrden) => {
    if (!idOrden) return [];
    try { return JSON.parse(localStorage.getItem(carritoKey(idOrden))) ?? []; }
    catch { return []; }
};

const guardarCarrito = (idOrden, carrito) => {
    if (!idOrden) return;
    localStorage.setItem(carritoKey(idOrden), JSON.stringify(carrito));
};

export const useMesaCart = (idOrden, turno) => {
    const [carrito, setCarrito] = useState(() => cargarCarrito(idOrden));

    // Precio según turno
    const precioSegunTurno = (producto) =>
        Number(turno === "comida" ? (producto.precioComida ?? 0) : (producto.precioDesayuno ?? 0));

    useEffect(() => {
        setCarrito(cargarCarrito(idOrden));
    }, [idOrden]);

    useEffect(() => {
        guardarCarrito(idOrden, carrito);
    }, [carrito, idOrden]);

    const limpiarCarrito = (mostrarAviso = true) => {
        if (carrito.length > 0 && mostrarAviso) {
            toast.info("Se limpió el carrito al cambiar de turno");
        }
        setCarrito([]);
    };

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

    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    return { 
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
    };
};
