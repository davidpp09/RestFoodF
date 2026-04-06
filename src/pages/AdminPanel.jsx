import { useState } from 'react';
import MesaAdmin from '../components/MesaAdmin'; // Asegúrate de que la ruta sea correcta

const AdminPanel = () => {
    const [mesas, setMesas] = useState(
        Array.from({ length: 40 }, (_, i) => {
            const id = i + 1;
            // Haremos que las mesas 2, 5 y 8 nazcan ocupadas para probar
            if ([2, 5, 8].includes(id)) {
                return {
                    id_mesa: id,
                    estado: "OCUPADA",
                    nombre_mesero: "Juan Pérez 🏃‍♂️",
                    id_orden: 100 + id,
                    platillos: [
                        { cantidad: 2, nombre: "Tacos al Pastor 🌮", comentarios: "Sin cebolla" },
                        { cantidad: 1, nombre: "Coca-Cola 🥤", comentarios: "Con hielo" },
                        { cantidad: 1, nombre: "Enchiladas 🍽️", comentarios: "Bien picantes" }
                    ]
                };
            }
            // El resto de las mesas nacen libres
            return {
                id_mesa: id,
                estado: "LIBRE",
                nombre_mesero: "",
                id_orden: null,
                platillos: []
            };
        })
    );

    return (
        <div className="h-screen flex flex-col bg-gray-100 p-4">
            {/* 1. Encabezado fijo */}
            <header className="mb-4">
                <h1 className="text-2xl font-bold">Panel de Administración en Vivo 👨‍💼</h1>
            </header>

            {/* 2. El área que crece y se adapta */}
            <main className="flex-1 overflow-auto">
                <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-8 gap-4 h-full content-start">
                    {mesas.map((mesa) => (
                        <MesaAdmin
                            key={mesa.id_mesa}
                            {...mesa} // Esto pasa id_mesa, estado, nombre_mesero, platillos, etc.
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;