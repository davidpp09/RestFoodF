import { LayoutDashboard, Users, TrendingUp, Package, Utensils, History } from 'lucide-react';

export const CONFIG_MENU = {
    SUPER_ROLES: [
        { icono: LayoutDashboard, texto: 'Panel de Mesas',  ruta: '/admin'           },
        { icono: Users,           texto: 'Personal',        ruta: '/admin/personal'  },
        { icono: TrendingUp,      texto: 'Reportes',        ruta: '/admin/reportes'  },
    ],
    MESERO: [
        { icono: Utensils, texto: 'Area de mesas', ruta: '/mesero' },
    ],
    COCINA: [
        { icono: Utensils, texto: 'Pedidos Cocina', ruta: '/cocina-panel' },
    ],
    REPARTIDOR: [
        { icono: Package, texto: 'Entregas Pendientes', ruta: '/entregas'           },
        { icono: History, texto: 'Historial',           ruta: '/entregas/historial' },
    ],
};
