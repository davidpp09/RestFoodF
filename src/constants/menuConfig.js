import { LayoutDashboard, Users, TrendingUp, Package, Utensils, History, ChefHat, ClipboardList } from 'lucide-react';

export const CONFIG_MENU = {
    ADMIN: [
        { icono: LayoutDashboard, texto: 'Panel de Mesas', ruta: '/admin'          },
        { icono: ClipboardList,   texto: 'Comandas',       ruta: '/admin/comandas' },
        { icono: Users,           texto: 'Personal',       ruta: '/admin/personal' },
        { icono: TrendingUp,      texto: 'Reportes',       ruta: '/admin/reportes' },
    ],
    DEV: [
        { icono: LayoutDashboard, texto: 'Panel de Mesas', ruta: '/admin'           },
        { icono: ClipboardList,   texto: 'Comandas',       ruta: '/admin/comandas'  },
        { icono: Users,           texto: 'Personal',       ruta: '/admin/personal'  },
        { icono: TrendingUp,      texto: 'Reportes',       ruta: '/admin/reportes'  },
        { icono: ChefHat,         texto: 'Platillos',      ruta: '/admin/platillos' },
    ],
    MESERO: [
        { icono: Utensils, texto: 'Area de mesas', ruta: '/mesero' },
    ],
    COCINA: [
        { icono: Utensils, texto: 'Pedidos Cocina', ruta: '/cocina-panel' },
    ],
    REPARTIDOR: [
        { icono: Package, texto: 'Área de Entrega',    ruta: '/entregas'           },
        { icono: History, texto: 'Historial',           ruta: '/entregas/historial' },
        { icono: Utensils, texto: 'Platillos del Día', ruta: '/entregas/dia'       },
    ],
};
