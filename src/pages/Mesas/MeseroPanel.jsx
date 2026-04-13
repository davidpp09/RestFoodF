import React from 'react';
import { useMesas } from '@/hooks/useMesas';
import { useProductos } from '@/hooks/useProductos';
import MesaMesero from '@/components/mesaMesero/MesaMesero';
import { ordenService } from '@/services/ordenService';
import { toast } from 'sonner';
import ImpresionTickets from '@/components/ImpresionTickets';
import { useTickets } from '@/hooks/useTickets';

const MeseroPanel = () => {
    const { mesas, cargando: cargandoMesas, actualizarMesa } = useMesas(1, 10);
    const { productos, cargando: cargandoProductos }          = useProductos();
    
    // Obtenemos el estado y funciones del ticket desde el hook
    const { ticket, setTicketManual, imprimirTicket, cerrarTicket } = useTickets();

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
            const ticketData = await ordenService.cerrarOrden(idOrden);
            
            // ✅ MOSTRAR TICKET MANUALMENTE:
            // Al no usar websockets en el mesero, activamos el modal con la respuesta directa del servidor
            setTicketManual(ticketData);
            
            // Actualizar estado local
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

            {/* ✅ PASAMOS EL ESTADO DEL TICKET COMO PROPS:
                Esto permite que el componente reaccione a la respuesta HTTP del cierre de orden */}
            <ImpresionTickets 
                ticket={ticket} 
                onImprimir={imprimirTicket} 
                onCerrar={cerrarTicket} 
            />
        </div>
    );
};

export default MeseroPanel;
