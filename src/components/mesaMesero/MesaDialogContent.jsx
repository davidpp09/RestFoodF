import React from 'react';
import { jwtDecode } from 'jwt-decode';
import MesaDialogHeader from './MesaDialogHeader';
import MesaMenu from './MesaMenu';
import MesaOrden from './MesaOrden';

const CATEGORIAS = ["Comida", "Especialidades", "Mariscos", "Bebidas", "Antojitos"];

const PRODUCTOS_MOCK = [
    { id_producto: 1, nombre: "Agua Mineral",    descripcion: "500ml",        precio: 2.50,  categoria: "Bebidas" },
    { id_producto: 2, nombre: "Refresco",        descripcion: "355ml",        precio: 3.00,  categoria: "Bebidas" },
    { id_producto: 3, nombre: "Jugo Natural",    descripcion: "Fruta fresca", precio: 4.50,  categoria: "Bebidas" },
    { id_producto: 4, nombre: "Cerveza",         descripcion: "330ml",        precio: 5.00,  categoria: "Bebidas" },
    { id_producto: 5, nombre: "Vino de la Casa", descripcion: "Copa",         precio: 8.00,  categoria: "Bebidas" },
    { id_producto: 6, nombre: "Tequila",         descripcion: "Shot",         precio: 6.00,  categoria: "Bebidas" },
    { id_producto: 7, nombre: "Margarita",       descripcion: "Copa",         precio: 10.00, categoria: "Bebidas" },
    { id_producto: 8, nombre: "Mojito",          descripcion: "Copa",         precio: 9.00,  categoria: "Bebidas" },
];

const CARRITO_MOCK = [
    { id_detalle: 42,   id_producto: 4, nombre: "Cerveza",  precio: 5.00, cantidad: 2, comentarios: "Con mucho hielo" },
    { id_detalle: null, id_producto: 2, nombre: "Refresco", precio: 3.00, cantidad: 1, comentarios: "" },
];

const TEMAS = {
    comida: {
        bg:           "bg-cyan-500",
        bgHover:      "hover:bg-cyan-600",
        bgTenue:      "bg-cyan-500/10",
        bgTenueHover: "hover:bg-cyan-500",
        text:         "text-cyan-500",
        textHover:    "hover:text-cyan-500",
        border:       "hover:border-cyan-500/50",
        shadow:       "shadow-cyan-900/30",
    },
    desayuno: {
        bg:           "bg-amber-500",
        bgHover:      "hover:bg-amber-600",
        bgTenue:      "bg-amber-500/10",
        bgTenueHover: "hover:bg-amber-500",
        text:         "text-amber-500",
        textHover:    "hover:text-amber-500",
        border:       "hover:border-amber-500/50",
        shadow:       "shadow-amber-900/30",
    },
};

const getIdUsuario = () => {
    try {
        const token = localStorage.getItem('token_restfood');
        return jwtDecode(token).id ?? null;
    } catch {
        return null;
    }
};

const MesaDialogContent = ({ mesa }) => {
    const [turno, setTurno]                     = React.useState("comida");
    const [categoriaActiva, setCategoriaActiva] = React.useState("Bebidas");
    const [carrito, setCarrito]                 = React.useState(CARRITO_MOCK);
    const [productos]                           = React.useState(PRODUCTOS_MOCK);

    const tema = TEMAS[turno];

    /* ── Carrito helpers ─────────────────────────────────────────────── */
    const agregarAlCarrito = (producto) => {
        setCarrito(prev => {
            const existe = prev.find(item => item.id_producto === producto.id_producto);
            if (existe) {
                return prev.map(item =>
                    item.id_producto === producto.id_producto
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [...prev, {
                id_detalle:  null,
                id_producto: producto.id_producto,
                nombre:      producto.nombre,
                precio:      producto.precio,
                cantidad:    1,
                comentarios: "",
            }];
        });
    };

    const cambiarCantidad = (id_producto, delta) => {
        setCarrito(prev =>
            prev
                .map(item => item.id_producto === id_producto
                    ? { ...item, cantidad: item.cantidad + delta }
                    : item
                )
                .filter(item => item.cantidad > 0)
        );
    };

    const eliminarItem = (id_producto) => {
        setCarrito(prev => prev.filter(item => item.id_producto !== id_producto));
    };

    const cambiarComentario = (id_producto, comentarios) => {
        setCarrito(prev =>
            prev.map(item =>
                item.id_producto === id_producto ? { ...item, comentarios } : item
            )
        );
    };

    /* ── Payload ─────────────────────────────────────────────────────── */
    const construirPayload = () => ({
        id_usuario: getIdUsuario(),
        id_orden:   mesa.id_orden ?? null,
        platillos:  carrito.map(({ id_detalle, id_producto, cantidad, comentarios }) => ({
            id_detalle,
            id_producto,
            cantidad,
            comentarios,
        })),
    });

    const handleActualizar = () => {
        console.log("Payload →", construirPayload());
        // TODO: llamar al servicio con construirPayload()
    };

    /* ── Totales ─────────────────────────────────────────────────────── */
    const subtotal = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const iva      = subtotal * 0.16;
    const total    = subtotal + iva;

    return (
        <div className="flex flex-col h-full min-h-0">
            <MesaDialogHeader mesa={mesa} turno={turno} setTurno={setTurno} tema={tema} />

            <div className="grid grid-cols-[1.5fr_1fr] gap-6 pt-6 flex-1 min-h-0">
                <MesaMenu
                    productos={productos}
                    categorias={CATEGORIAS}
                    categoriaActiva={categoriaActiva}
                    setCategoriaActiva={setCategoriaActiva}
                    onAgregar={agregarAlCarrito}
                    tema={tema}
                />
                <MesaOrden
                    carrito={carrito}
                    subtotal={subtotal}
                    iva={iva}
                    total={total}
                    tema={tema}
                    onCambiarCantidad={cambiarCantidad}
                    onEliminar={eliminarItem}
                    onCambiarComentario={cambiarComentario}
                    onActualizar={handleActualizar}
                />
            </div>
        </div>
    );
};

export default MesaDialogContent;
