import React from 'react';
import { useMesas } from '@/hooks/useMesas';
import { useProductos } from '@/hooks/useProductos';
import MesaMesero from '@/components/mesaMesero/MesaMesero';
import { ordenService } from '@/services/ordenService';
import { toast } from 'sonner';
import ImpresionTickets from '@/components/ImpresionTickets';

const MeseroPanel = () => {
    const { mesas, cargando: cargandoMesas, actualizarMesa } = useMesas(1, 10);
    const { productos, cargando: cargandoProductos }          = useProductos();

    const registrarOrden = (mesaId, idOrden) => {
        actualizarMesa(mesaId, { id_orden: idOrden, estado: 'OCUPADA' });
    };

    const liberarMesa = async (mesaId) => {
        const mesa = mesas.find(m => (m.id === mesaId || m.id_mesa === mesaId));
        const idOrden = mesa?.id_orden;

        if (!idOrden) {
            toast.error("No hay una orden activa para cerrar");
            return;
        }

        try {
            // Llamar al backend para cerrar la orden y liberar la mesa
            await ordenService.cerrarOrden(idOrden);
            // Actualizar estado local (aunque el WebSocket también lo hará)
            actualizarMesa(mesaId, { id_orden: null, estado: 'LIBRE' });
            toast.success(`Mesa ${mesa.numero} cerrada correctamente`);
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "Error al cerrar la mesa";
            toast.error(mensaje);
        }
    };

    if (cargandoMesas || cargandoProductos) {
        return <div className="text-white">Cargando... ⏳</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {mesas.map((mesa) => {
                    const mesaId = mesa.id ?? mesa.id_mesa;
                    return (
                        <MesaMesero
                            key={mesaId}
                            mesa={mesa}
                            productos={productos}
                            idOrden={mesa.id_orden ?? null}
                            onOrdenCreada={(idOrden) => registrarOrden(mesaId, idOrden)}
                            onOrdenCerrada={() => liberarMesa(mesaId)}
                        />
                    );
                })}
            </div>

            {/* Este componente escucha el WebSocket y muestra el ticket cuando llega */}
            <ImpresionTickets />
        </div>
    );
};

export default MeseroPanel;
