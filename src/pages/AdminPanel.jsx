// src/pages/AdminPanel.jsx
import { useState } from 'react';
import MesaAdmin from '../components/MesaAdmin'; //

const AdminPanel = () => {
    // Simulamos las 40 mesas para la cuadrícula
    const [mesas] = useState(Array.from({ length: 40 }, (_, i) => ({
        id_mesa: i + 1,
        estado: i % 5 === 0 ? "OCUPADA" : "LIBRE",
        nombre_mesero: "Juan",
        platillos: []
    })));

    return (
        // 'h-screen' fija el alto total y 'overflow-hidden' evita el scroll de la página
        <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden">

            {/* Encabezado con altura automática */}
            <header className="p-4 bg-white border-b shadow-sm">
                <h1 className="text-xl font-bold text-slate-800">Panel de Administración</h1>
            </header>

            {/* Área principal: 'flex-1' toma el resto de la pantalla */}
            <main className="flex-1 p-3 overflow-hidden">
                {/* Configuramos 8 columnas y 5 filas fijas (para las 40 mesas).
          'h-full' obliga a la cuadrícula a estirarse hasta el borde inferior.
        */}
                <div className="grid grid-cols-8 grid-rows-5 gap-2 h-full w-full">
                    {mesas.map((mesa) => (
                        <MesaAdmin key={mesa.id_mesa} {...mesa} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;