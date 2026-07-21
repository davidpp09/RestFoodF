import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ROLES } from '../constants/roles';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const obtenerRutaPorRol = (rol) => {
    const rutas = {
        [ROLES.DEV]:        '/admin',
        [ROLES.ADMIN]:      '/admin',
        [ROLES.MESERO]:     '/mesero',
        [ROLES.COCINA]:     '/cocina-panel',
        [ROLES.REPARTIDOR]: '/entregas',
    };
    return rutas[rol] ?? '/login';
};

export const formatearDinero = (cantidad) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(cantidad);

// Minúsculas y sin acentos, para que "cafe" encuentre "Café" en las búsquedas del menú.
export const normalizarTexto = (texto) =>
    texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
