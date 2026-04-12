// src/components/ImpresionTickets.jsx
// Componente de confirmación visual + impresión de tickets
// Se monta en el panel de meseras cuando esté listo
import { useTickets } from '../hooks/useTickets';

const ImpresionTickets = () => {
    const { ticket, imprimirTicket, cerrarTicket } = useTickets();

    if (!ticket) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={cerrarTicket}
        >
            <div
                className="bg-white text-black rounded-xl shadow-2xl p-6 w-72 max-h-[90vh] overflow-y-auto"
                style={{ fontFamily: "'Courier New', monospace" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Encabezado */}
                <div className="text-center mb-3">
                    <div className="text-xl font-bold">RESTFOOD</div>
                    <div className="text-sm">Ticket de Venta</div>
                </div>
                <hr className="border-dashed border-black mb-3" />

                {/* Info de la orden */}
                <div className="text-xs space-y-1 mb-3">
                    <div><strong>Orden:</strong> #{ticket.id_orden}</div>
                    <div><strong>Mesa:</strong> {ticket.numeroMesa || 'Para Llevar'}</div>
                    <div><strong>Tipo:</strong> {ticket.tipoOrden}</div>
                    <div><strong>Fecha:</strong> {new Date(ticket.fechaCierre).toLocaleString('es-MX')}</div>
                </div>

                <hr className="border-dashed border-black mb-2" />
                <div className="text-xs font-bold mb-2">CONSUMO</div>
                <hr className="border-dashed border-black mb-2" />

                {/* Platillos */}
                <div className="text-xs space-y-2 mb-3">
                    {ticket.platillos?.map((p, i) => (
                        <div key={i}>
                            <div className="flex justify-between">
                                <span>{p.cantidad}x {p.nombre_producto}</span>
                                <span>${p.subtotal.toFixed(2)}</span>
                            </div>
                            {p.comentarios && (
                                <div className="text-gray-500 ml-4">({p.comentarios})</div>
                            )}
                        </div>
                    ))}
                </div>

                <hr className="border-dashed border-black mb-2" />
                <div className="flex justify-between font-bold text-base mb-1">
                    <span>TOTAL:</span>
                    <span>${ticket.total.toFixed(2)}</span>
                </div>
                <hr className="border-dashed border-black mb-3" />

                <div className="text-center text-xs">¡Gracias por su visita!</div>
                <div className="text-center text-xs text-gray-500 mt-1">Estado: {ticket.estatus}</div>

                {/* Acciones */}
                <div className="flex gap-2 mt-4">
                    <button
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 rounded-lg transition"
                        onClick={() => imprimirTicket()}
                    >
                        Imprimir
                    </button>
                    <button
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-2 rounded-lg transition"
                        onClick={cerrarTicket}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImpresionTickets;
