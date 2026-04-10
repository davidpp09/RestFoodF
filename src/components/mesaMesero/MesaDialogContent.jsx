import React from 'react';
import MesaDialogHeader from './MesaDialogHeader';
import MesaMenu from './MesaMenu';
import MesaOrden from './MesaOrden';

const CATEGORIAS = ["Comida", "Especialidades", "Mariscos", "Bebidas", "Antojitos"];

const PRODUCTOS_MOCK = [
    { id: 1, nombre: "Agua Mineral",    descripcion: "500ml",        precio: 2.50, categoria: "Bebidas" },
    { id: 2, nombre: "Refresco",        descripcion: "355ml",        precio: 3.00, categoria: "Bebidas" },
    { id: 3, nombre: "Jugo Natural",    descripcion: "Fruta fresca", precio: 4.50, categoria: "Bebidas" },
    { id: 4, nombre: "Cerveza",         descripcion: "330ml",        precio: 5.00, categoria: "Bebidas" },
    { id: 5, nombre: "Vino de la Casa", descripcion: "Copa",         precio: 8.00, categoria: "Bebidas" },
    { id: 6, nombre: "Tequila",         descripcion: "Shot",         precio: 6.00, categoria: "Bebidas" },
    { id: 7, nombre: "Margarita",       descripcion: "Copa",         precio: 10.00, categoria: "Bebidas" },
    { id: 8, nombre: "Mojito",          descripcion: "Copa",         precio: 9.00, categoria: "Bebidas" },
];

const CARRITO_MOCK = [
    { id: 1, nombre: "Cerveza",  precio: 5.00, cantidad: 2 },
    { id: 2, nombre: "Ensalada", precio: 9.50, cantidad: 2 },
];

const TEMAS = {
    comida: {
        bg:          "bg-cyan-500",
        bgHover:     "hover:bg-cyan-600",
        bgTenue:     "bg-cyan-500/10",
        bgTenueHover:"hover:bg-cyan-500",
        text:        "text-cyan-500",
        textHover:   "hover:text-cyan-500",
        border:      "hover:border-cyan-500/50",
        shadow:      "shadow-cyan-900/30",
    },
    desayuno: {
        bg:          "bg-amber-500",
        bgHover:     "hover:bg-amber-600",
        bgTenue:     "bg-amber-500/10",
        bgTenueHover:"hover:bg-amber-500",
        text:        "text-amber-500",
        textHover:   "hover:text-amber-500",
        border:      "hover:border-amber-500/50",
        shadow:      "shadow-amber-900/30",
    },
};

const MesaDialogContent = ({ mesa }) => {
    const [turno, setTurno]                     = React.useState("comida");
    const [categoriaActiva, setCategoriaActiva] = React.useState("Comida");
    const [carrito]                             = React.useState(CARRITO_MOCK);
    const [productos]                           = React.useState(PRODUCTOS_MOCK);

    const tema = TEMAS[turno];

    const subtotal = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const iva      = subtotal * 0.16;
    const total    = subtotal + iva;

    return (
        <>
            <MesaDialogHeader mesa={mesa} turno={turno} setTurno={setTurno} tema={tema} />

            <div className="grid grid-cols-[1.5fr_1fr] gap-6 py-6 h-[600px]">
                <MesaMenu
                    productos={productos}
                    categorias={CATEGORIAS}
                    categoriaActiva={categoriaActiva}
                    setCategoriaActiva={setCategoriaActiva}
                    tema={tema}
                />
                <MesaOrden
                    carrito={carrito}
                    subtotal={subtotal}
                    iva={iva}
                    total={total}
                    tema={tema}
                />
            </div>
        </>
    );
};

export default MesaDialogContent;
