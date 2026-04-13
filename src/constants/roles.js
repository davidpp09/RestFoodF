export const ROLES = {
    ADMIN:      'ADMIN',
    DEV:        'DEV',
    MESERO:     'MESERO',
    COCINA:     'COCINA',
    CAJERO:     'CAJERO',
    REPARTIDOR: 'REPARTIDOR',
};

export const SUPER_ROLES = [ROLES.DEV, ROLES.ADMIN];

// Roles disponibles para crear/asignar desde la UI (sin DEV)
export const ROLES_FORM = [ROLES.ADMIN, ROLES.MESERO, ROLES.COCINA, ROLES.CAJERO, ROLES.REPARTIDOR];