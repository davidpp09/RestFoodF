import { formatearDinero } from '@/lib/utils';

// Orden y etiqueta de los grupos por rol. Los roles no listados caen en "Otros".
const GRUPOS = [
    { rol: 'MESERO',     label: 'Meseros',        color: 'text-rf-blue' },
    { rol: 'REPARTIDOR', label: 'Repartidores',   color: 'text-rf-green' },
    { rol: 'CAJERO',     label: 'Caja',           color: 'text-rf-accent' },
    { rol: 'ADMIN',      label: 'Administración',  color: 'text-rf-text-2' },
    { rol: 'DEV',        label: 'Administración',  color: 'text-rf-text-2' },
];

const etiquetaGrupo = (rol) => GRUPOS.find((g) => g.rol === rol) ?? { rol, label: 'Otros', color: 'text-rf-text-2' };

const GrupoVentas = ({ label, color, filas }) => {
    const subtotal = filas.reduce((acc, f) => acc + Number(f.total || 0), 0);
    const ordenes  = filas.reduce((acc, f) => acc + Number(f.cantidad || 0), 0);
    const ordenadas = [...filas].sort((a, b) => Number(b.total) - Number(a.total));

    return (
        <div className="rounded-lg border border-rf-border bg-rf-surface overflow-hidden">
            {/* Encabezado del grupo con subtotal */}
            <div className="flex items-center justify-between px-4 py-3 bg-rf-surface-2 border-b border-rf-border">
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold uppercase tracking-wide ${color}`}>{label}</span>
                    <span className="text-xs text-rf-text-3">· {filas.length} {filas.length === 1 ? 'persona' : 'personas'} · {ordenes} órd.</span>
                </div>
                <span className="text-lg font-bold font-mono text-rf-text">{formatearDinero(subtotal)}</span>
            </div>

            {/* Ranking de personas */}
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-rf-text-3 text-[11px] uppercase tracking-wide border-b border-rf-border">
                        <th className="text-left  px-4 py-2 font-semibold">#</th>
                        <th className="text-left  px-4 py-2 font-semibold">Nombre</th>
                        <th className="text-right px-4 py-2 font-semibold">Órdenes</th>
                        <th className="text-right px-4 py-2 font-semibold">Vendido</th>
                    </tr>
                </thead>
                <tbody>
                    {ordenadas.map((f, i) => (
                        <tr key={f.nombre} className="border-b border-rf-border last:border-0 hover:bg-rf-surface-2/50">
                            <td className="px-4 py-2.5 text-rf-text-3 font-mono">{i + 1}</td>
                            <td className="px-4 py-2.5 text-rf-text font-semibold">{f.nombre}</td>
                            <td className="px-4 py-2.5 text-right text-rf-text-2 font-mono">{f.cantidad}</td>
                            <td className="px-4 py-2.5 text-right text-rf-text font-bold font-mono">{formatearDinero(f.total)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const VentasPorPersona = ({ datos }) => {
    if (!datos || datos.length === 0) {
        return <div className="py-8 text-center text-rf-text-3">No hay ventas registradas este día</div>;
    }

    // Agrupar por etiqueta de grupo (MESERO→Meseros, etc.), preservando el orden de GRUPOS.
    const porGrupo = new Map();
    for (const fila of datos) {
        const { label, color } = etiquetaGrupo(fila.rol);
        if (!porGrupo.has(label)) porGrupo.set(label, { label, color, filas: [] });
        porGrupo.get(label).filas.push(fila);
    }

    // Orden de aparición: primero los grupos definidos en GRUPOS, luego "Otros".
    const ordenLabels = [...new Set(GRUPOS.map((g) => g.label)), 'Otros'];
    const grupos = [...porGrupo.values()].sort(
        (a, b) => ordenLabels.indexOf(a.label) - ordenLabels.indexOf(b.label)
    );

    return (
        <div className="space-y-4">
            {grupos.map((g) => (
                <GrupoVentas key={g.label} label={g.label} color={g.color} filas={g.filas} />
            ))}
        </div>
    );
};

export default VentasPorPersona;
