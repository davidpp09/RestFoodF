import { LayoutDashboard, Users, TrendingUp, Package, Utensils, History, ChefHat, ClipboardList, Boxes, PackagePlus, ClipboardCheck } from 'lucide-react';

export const CONFIG_MENU = {
    ADMIN: [
        { icono: LayoutDashboard, texto: 'Panel de Mesas', ruta: '/admin'          },
        { icono: ClipboardList,   texto: 'Comandas',       ruta: '/admin/comandas' },
        { icono: Users,           texto: 'Personal',       ruta: '/admin/personal' },
        { icono: TrendingUp,      texto: 'Reportes',       ruta: '/admin/reportes' },
        { icono: Boxes,           texto: 'Existencias',    ruta: '/admin/existencias' },
        { icono: ClipboardCheck,  texto: 'Capturar',       ruta: '/admin/captura'   },
        { icono: PackagePlus,     texto: 'Insumos',        ruta: '/admin/insumos'   },
    ],
    DEV: [
        { icono: LayoutDashboard, texto: 'Panel de Mesas', ruta: '/admin'           },
        { icono: ClipboardList,   texto: 'Comandas',       ruta: '/admin/comandas'  },
        { icono: Users,           texto: 'Personal',       ruta: '/admin/personal'  },
        { icono: TrendingUp,      texto: 'Reportes',       ruta: '/admin/reportes'  },
        { icono: ChefHat,         texto: 'Platillos',      ruta: '/admin/platillos' },
        { icono: Boxes,           texto: 'Existencias',    ruta: '/admin/existencias' },
        { icono: ClipboardCheck,  texto: 'Capturar',       ruta: '/admin/captura'   },
        { icono: PackagePlus,     texto: 'Insumos',        ruta: '/admin/insumos'   },
    ],
    MESERO: [
        { icono: Utensils, texto: 'Area de mesas', ruta: '/mesero' },
    ],
    // Una sola opción, pero el menú se conserva: el botón de cerrar sesión
    // vive dentro del cajón de navegación.
    COCINA: [
        { icono: Boxes, texto: 'Inventario', ruta: '/cocina-panel' },
    ],
    REPARTIDOR: [
        { icono: Package, texto: 'Área de Entrega',    ruta: '/entregas'           },
        { icono: History, texto: 'Historial',           ruta: '/entregas/historial' },
        { icono: Utensils, texto: 'Platillos del Día', ruta: '/entregas/dia'       },
    ],
};
