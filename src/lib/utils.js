import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { ROLES } from '../constants/roles';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const obtenerRutaPorRol = (rol) => {
    const rutasPorRol = {
        [ROLES.DEV]: "/adminpanel",
        [ROLES.ADMIN]: "/adminpanel",
        [ROLES.MESERO]: "/pedidos",
        [ROLES.COCINA]: "/cocina-panel",
        [ROLES.REPARTIDOR]: "/entregas"
    };
    return rutasPorRol[rol] || "/login";
};
