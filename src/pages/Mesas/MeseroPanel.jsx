import React from 'react';
import { useMesas } from '@/hooks/useMesas';
import MesaMesero from '@/components/MesaMesero';
const MeseroPanel = () => {
    const { mesas, cargando } = useMesas(1, 10);
    if (cargando) {
        return <div className="text-white">Cargando mesas... ⏳</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {mesas.map((mesa) => (
                    <MesaMesero key={mesa.id} mesa={mesa} />
                ))}
            </div>
        </div>
    );
};

export default MeseroPanel;