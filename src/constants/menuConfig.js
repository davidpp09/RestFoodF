import { LayoutDashboard, Users, TrendingUp, Package, Utensils, History, ChefHat, ClipboardList, Boxes, PackagePlus } from 'lucide-react';

export const CONFIG_MENU = {
    ADMIN: [
        { icono: LayoutDashboard, texto: 'Panel de Mesas', ruta: '/admin'          },
        { icono: ClipboardList,   texto: 'Comandas',       ruta: '/admin/comandas' },
        { icono: Users,           texto: 'Personal',       ruta: '/admin/personal' },
        { icono: TrendingUp,      texto: 'Reportes',       ruta: '/admin/reportes' },
        { icono: Boxes,           texto: 'Existencias',    ruta: '/admin/existencias' },
        { icono: PackagePlus,     texto: 'Insumos',        ruta: '/admin/insumos'   },
    ],
    DEV: [
        { icono: LayoutDashboard, texto: 'Panel de Mesas', ruta: '/admin'           },
        { icono: ClipboardList,   texto: 'Comandas',       ruta: '/admin/comandas'  },
        { icono: Users,           texto: 'Personal',       ruta: '/admin/personal'  },
        { icono: TrendingUp,      texto: 'Reportes',       ruta: '/admin/reportes'  },
        { icono: ChefHat,         texto: 'Platillos',      ruta: '/admin/platillos' },
        { icono: Boxes,           texto: 'Existencias',    ruta: '/admin/existencias' },
        { icono: PackagePlus,     texto: 'Insumos',        ruta: '/admin/insumos'   },
    ],
    MESERO: [
        { icono: Utensils, texto: 'Area de mesas', ruta: '/mesero' },
    ],
    COCINA: [
        { icono: Utensils,     texto: 'Pedidos Cocina', ruta: '/cocina-panel'            },
        { icono: PackagePlus,  texto: 'Inventario',     ruta: '/cocina-panel/inventario' },
    ],
    REPARTIDOR: [
        { icono: Package, texto: 'Área de Entrega',    ruta: '/entregas'           },
        { icono: History, texto: 'Historial',           ruta: '/entregas/historial' },
        { icono: Utensils, texto: 'Platillos del Día', ruta: '/entregas/dia'       },
    ],
};
