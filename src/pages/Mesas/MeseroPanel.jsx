import React from 'react';
import { useMesas } from '@/hooks/useMesas';
import { useProductos } from '@/hooks/useProductos';
import { useAuth } from '@/hooks/useAuth';
import MesaMesero from '@/components/mesaMesero/MesaMesero';
import { ordenService } from '@/services/ordenService';
import { toast } from 'sonner';
import ImpresionTickets from '@/components/ImpresionTickets';
import { useTickets } from '@/hooks/useTickets';

// Rango de mesas (por id/número) que atiende cada sección. Reparto desigual:
// Valeria (1) → 15 mesas, Magui (2) → 15 mesas, Mareli (3) → 20 mesas.
const SECCION_RANGOS = {
    1: { inicio: 1,  fin: 15 },
    2: { inicio: 16, fin: 30 },
    3: { inicio: 31, fin: 50 },
};

const MeseroPanel = () => {
    const { getSeccion } = useAuth();
    const seccion = getSeccion() ?? 1;
    const { inicio: mesaInicio, fin: mesaFin } = SECCION_RANGOS[seccion] ?? SECCION_RANGOS[1];

    const { mesas, cargando: cargandoMesas, error: errorMesas, actualizarMesa } = useMesas(mesaInicio, mesaFin);
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
            const ticketData = await ordenService.cerrarOrden(idOrden);
            
            // 1. Liberar la mesa en el mapa visual
            actualizarMesa(mesaId, { id_orden: null, estado: 'LIBRE' });

            // 2. Mostrar el ticket para impresión
            setTicketManual(ticketData);

            toast.success(`Mesa ${mesa.numero} cerrada correctamente`);
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "Error al cerrar la mesa";
            toast.error(mensaje);
        }
    };

    const cancelarMesa = async (mesaId) => {
        const mesa = mesas.find(m => (m.id === mesaId || m.id_mesa === mesaId));
        const idOrden = mesa?.id_orden;

        if (!idOrden) {
            toast.error("No hay una orden activa para cancelar");
            return;
        }

        try {
            await ordenService.cancelarOrden(idOrden);
            actualizarMesa(mesaId, { id_orden: null, estado: 'LIBRE' });
            toast.success(`Mesa ${mesa.numero} cancelada`);
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "Error al cancelar la mesa";
            toast.error(mensaje);
        }
    };

    if (cargandoMesas || cargandoProductos) {
        return <div className="text-rf-text-2">Cargando... ⏳</div>;
    }

    if (errorMesas) {
        return <div className="text-rf-red-ink p-6">Error al cargar las mesas. Verifica la conexión con el servidor.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 portrait:grid-cols-3 landscape:grid-cols-4 xl:landscape:grid-cols-5 gap-4">
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
                            onOrdenCancelada={() => cancelarMesa(mesaId)}
                        />
                    );
                })}
            </div>

            <ImpresionTickets
                ticket={ticket} 
                onImprimir={imprimirTicket} 
                onCerrar={cerrarTicket} 
            />
        </div>
    );
};

export default MeseroPanel;
