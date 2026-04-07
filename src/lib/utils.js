import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { ROLES, SUPER_ROLES } from '../constants/roles';
import { LayoutDashboard, Users, TrendingUp, History, Package } from "lucide-react";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const obtenerRutaPorRol = (rol) => {
    const rutasPorRol = {
        [ROLES.DEV]: "/admin",
        [ROLES.ADMIN]: "/admin",
        [ROLES.MESERO]: "/pedidos",
        [ROLES.COCINA]: "/cocina-panel",
        [ROLES.REPARTIDOR]: "/entregas"
    };
    return rutasPorRol[rol] || "/login";
};

export const CONFIG_MENU = {
    SUPER_ROLES: [
        { icono: LayoutDashboard, texto: "Panel de Mesas", ruta: "/admin" },
        { icono: Users, texto: "Personal", ruta: "/admin/personal" },
        { icono: TrendingUp, texto: "Reportes", ruta: "/admin/reportes" }
    ],
    REPARTIDOR: [
        { icono: Package, texto: "Entregas Pendientes", ruta: "/entregas" },
        { icono: History, texto: "Historial", ruta: "/entregas/historial" }
    ]
}