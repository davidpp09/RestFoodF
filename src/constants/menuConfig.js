import { LayoutDashboard, Users, TrendingUp, Package, Utensils, History, ChefHat, ClipboardList, Boxes, PackagePlus, ClipboardCheck, BookOpen, Scale, DollarSign } from 'lucide-react';

// ADMIN y DEV ven exactamente lo mismo. Estaban escritos como dos listas
// separadas y el 2026-08-11 se descubrió que habían divergido en silencio: a
// ADMIN le faltaba "Platillos". Una sola lista para los dos roles hace que no
// pueda volver a pasar; si algún día uno necesita algo que el otro no, se
// separan a propósito y no por olvido.
const MENU_SUPER = [
    { icono: LayoutDashboard, texto: 'Panel de Mesas',    ruta: '/admin'             },
    { icono: ClipboardList,   texto: 'Comandas',          ruta: '/admin/comandas'    },
    { icono: Users,           texto: 'Personal',          ruta: '/admin/personal'    },
    { icono: TrendingUp,      texto: 'Reportes',          ruta: '/admin/reportes'    },
    { icono: ChefHat,         texto: 'Platillos',         ruta: '/admin/platillos'   },
    { icono: Boxes,           texto: 'Existencias',       ruta: '/admin/existencias' },
    { icono: ClipboardCheck,  texto: 'Capturar',          ruta: '/admin/captura'     },
    { icono: PackagePlus,     texto: 'Insumos',           ruta: '/admin/insumos'     },
    { icono: BookOpen,        texto: 'Recetas',           ruta: '/admin/recetas'     },
    { icono: Scale,           texto: 'Teórico vs real',   ruta: '/admin/varianza'    },
    { icono: DollarSign,      texto: 'Costos',            ruta: '/admin/costos'      },
    // La ruta ya aceptaba a DEV y ADMIN (App.jsx, SUPER_ROLES); solo faltaba
    // la entrada en el menú para llegar sin escribir la URL a mano.
    { icono: Utensils,        texto: 'Platillos del Día', ruta: '/entregas/dia'      },
];

export const CONFIG_MENU = {
    ADMIN: MENU_SUPER,
    DEV:   MENU_SUPER,
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
