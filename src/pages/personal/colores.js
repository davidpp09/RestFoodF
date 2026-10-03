// Un color por mesera, para reconocer de un vistazo de quién es cada mesa.
// Se asigna por orden de id (estable: no cambia al dar de alta a otra).
const PALETA = [
    { mesa: 'bg-rf-blue-soft text-rf-blue-ink border-rf-blue',       punto: 'bg-rf-blue' },
    { mesa: 'bg-rf-green-soft text-rf-green-ink border-rf-green',    punto: 'bg-rf-green' },
    { mesa: 'bg-rf-turno-soft text-rf-turno-ink border-rf-turno',    punto: 'bg-rf-turno' },
    { mesa: 'bg-rf-cyan-soft text-rf-cyan-ink border-rf-cyan',       punto: 'bg-rf-cyan' },
    { mesa: 'bg-rf-accent-soft text-rf-accent-ink border-rf-accent', punto: 'bg-rf-accent' },
    { mesa: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500', punto: 'bg-violet-500' },
];

export const SIN_ASIGNAR = { mesa: 'bg-rf-bg text-rf-text-3 border-rf-border-strong border-dashed', punto: 'bg-rf-border-strong' };

export const colorDeMesera = (meseras, idUsuario) => {
    const i = meseras.findIndex(m => m.id_usuarios === idUsuario);
    return i < 0 ? SIN_ASIGNAR : PALETA[i % PALETA.length];
};

export const coloresRoles = {
    ADMIN: "text-rf-red-ink bg-rf-red-soft",
    MESERO: "text-rf-blue-ink bg-rf-blue-soft",
    COCINA: "text-rf-accent-ink bg-rf-accent-soft",
    CAJERO: "text-rf-green-ink bg-rf-green-soft",
    DEV: "text-violet-700 bg-violet-500/10 dark:text-violet-300",
    REPARTIDOR: "text-rf-cyan-ink bg-rf-cyan-soft",
};
