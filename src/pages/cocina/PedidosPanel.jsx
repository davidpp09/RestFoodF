import React, { useEffect, useState } from 'react';
import { cocinaService } from '../../services/cocinaService';
import websocketService from '../../services/websocketService';
import { toast } from 'sonner';
import { UtensilsCrossed, CheckCircle2, Clock, ShoppingBag } from 'lucide-react';

const PedidosPanel = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [cargando, setCargando] = useState(true);

    const cargarOrdenes = async () => {
        try {
            const data = await cocinaService.obtenerOrdenesPendientes();
            setOrdenes(data);
        } catch {
            toast.error("Error al cargar los pedidos");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarOrdenes();

        const token = sessionStorage.getItem('token_restfood');

        if (token) {
            websocketService.conectar(token);
            websocketService.subscribe('/topic/cocina', (mensaje) => {
                console.log("🔥 [WS Cocina] Recibido mensaje:", mensaje);
                // Mesa cerrada: quitar la orden del panel sin importar si se marcó como lista
                if (mensaje.accion === 'CERRADA') {
                    setOrdenes(prev => prev.filter(o => o.id_orden !== mensaje.id_orden));
                    return;
                }
                // Nuevo pedido o modificación: recargar la lista
                if (mensaje.platillos && mensaje.platillos.length > 0) {
                    cargarOrdenes();
                    toast.info(`Nuevo ticket recibido - Orden #${mensaje.id_orden}`);
                }
            });
        }

        return () => websocketService.desconectar();
    }, []);

    const marcarComoListo = async (idOrden) => {
        try {
            await cocinaService.marcarServido(idOrden);
            toast.success(`Orden #${idOrden} marcada como lista`);
            setOrdenes(prev => prev.filter(o => o.id_orden !== idOrden));
        } catch {
            toast.error("Error al marcar la orden como lista");
        }
    };

    if (cargando) {
        return <div className="p-10 text-white">Cargando pedidos...</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-500/20 p-3 rounded-xl border border-orange-500/30">
                    <UtensilsCrossed className="text-orange-500" size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Panel de Cocina</h1>
                    <p className="text-slate-400 text-sm">Gestiona los pedidos entrantes</p>
                </div>
            </div>

            {ordenes.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
                    <UtensilsCrossed size={48} className="text-slate-700 mb-4" />
                    <h3 className="text-xl font-bold text-slate-400">No hay pedidos pendientes</h3>
                    <p className="text-slate-500 text-sm mt-2">La cocina está al día</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                    {ordenes.map((orden) => (
                        <div key={orden.id_orden} className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col">
                            {/* Header del Ticket */}
                            <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Orden</p>
                                    <p className="text-2xl font-black text-white">#{orden.id_orden}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {orden.tipo === 'LOZA' ? (
                                            <div className="flex items-center gap-1.5 text-orange-400">
                                                <UtensilsCrossed size={12} />
                                                <span className="text-[10px] font-bold tracking-wider">MESA {orden.id_mesa}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-purple-400">
                                                <ShoppingBag size={12} />
                                                <span className="text-[10px] font-bold tracking-wider">PARA LLEVAR</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20 flex items-center gap-2">
                                    <Clock size={16} className="text-orange-500 animate-pulse" />
                                    <span className="text-orange-500 font-bold text-sm">En Proceso</span>
                                </div>
                            </div>

                            {/* Lista de Platillos */}
                            <div className="p-4 flex-1 flex flex-col gap-3">
                                {orden.platillos.map((p, idx) => (
                                    <div key={idx} className="flex gap-3 items-start border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                                        <div className="bg-slate-800 text-cyan-400 font-black px-2 py-1 rounded text-sm min-w-[2rem] text-center">
                                            {p.cantidad}x
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-slate-200 font-bold leading-tight">{p.nombre_producto}</p>
                                            {p.comentarios && (
                                                <p className="text-slate-500 text-xs mt-1 italic border-l-2 border-orange-500/50 pl-2">
                                                    "{p.comentarios}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Acción */}
                            <div className="p-4 pt-0">
                                <button
                                    onClick={() => marcarComoListo(orden.id_orden)}
                                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={18} />
                                    MARCAR LISTO
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PedidosPanel;