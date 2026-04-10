// src/hooks/useTickets.js
// Hook de impresión de tickets — para usar en el panel de meseras
import { useState, useEffect } from 'react';
import websocketService from '../services/websocketService';
import { toast } from 'sonner';

export const useTickets = () => {
    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token_restfood');
        if (!token) return;

        websocketService.conectar(token);

        websocketService.subscribe('/topic/tickets', (ticketRecibido) => {
            console.log('🎫 Ticket recibido:', ticketRecibido);
            setTicket(ticketRecibido);
            toast.info(`Ticket listo — Mesa ${ticketRecibido.numeroMesa || 'Para llevar'}`);
        });

        return () => websocketService.desconectar();
    }, []);

    const imprimirTicket = (ticketData = ticket) => {
        if (!ticketData) return;

        const ventana = window.open('', '_blank', 'width=320,height=650');
        if (!ventana) {
            toast.error('Bloqueador de pop-ups activo. Permítelo para imprimir.');
            return;
        }

        ventana.document.write(generarHTMLTicket(ticketData));
        ventana.document.close();

        setTimeout(() => {
            ventana.print();
            setTimeout(() => ventana.close(), 1000);
        }, 500);
    };

    const cerrarTicket = () => setTicket(null);

    return { ticket, imprimirTicket, cerrarTicket };
};

// Generación del HTML del ticket (separado para poder reutilizarlo)
export const generarHTMLTicket = (ticket) => `
    <html>
    <head>
        <title>Ticket #${ticket.id_orden}</title>
        <style>
            body { font-family: 'Courier New', monospace; font-size: 12px; width: 80mm; margin: 0; padding: 10px; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { border-top: 1px dashed #000; margin: 5px 0; }
            .row { display: flex; justify-content: space-between; margin: 3px 0; }
            .total { font-size: 15px; font-weight: bold; }
            .nota { font-size: 10px; margin-left: 16px; color: #555; }
        </style>
    </head>
    <body>
        <div class="center bold" style="font-size:16px">RESTFOOD</div>
        <div class="center">Ticket de Venta</div>
        <div class="line"></div>
        <div><strong>Orden:</strong> #${ticket.id_orden}</div>
        <div><strong>Mesa:</strong> ${ticket.numeroMesa || 'Para Llevar'}</div>
        <div><strong>Tipo:</strong> ${ticket.tipoOrden}</div>
        <div><strong>Fecha:</strong> ${new Date(ticket.fechaCierre).toLocaleString('es-MX')}</div>
        <div class="line"></div>
        <div class="bold">CONSUMO</div>
        <div class="line"></div>
        ${ticket.platillos?.map(p => `
            <div class="row">
                <span>${p.cantidad}x ${p.nombreProducto}</span>
                <span>$${p.subtotal.toFixed(2)}</span>
            </div>
            ${p.comentarios ? `<div class="nota">(${p.comentarios})</div>` : ''}
        `).join('')}
        <div class="line"></div>
        <div class="row total">
            <span>TOTAL:</span>
            <span>$${ticket.total.toFixed(2)}</span>
        </div>
        <div class="line"></div>
        <div class="center">¡Gracias por su visita!</div>
        <div class="center" style="font-size:10px;margin-top:8px">Estado: ${ticket.estatus}</div>
    </body>
    </html>
`;
