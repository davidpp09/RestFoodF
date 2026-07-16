import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORES = ['var(--rf-accent)', 'var(--rf-blue)', 'var(--rf-green)', 'var(--rf-cyan)', '#8b5cf6', 'var(--rf-red)'];

const GraficaVentasEmpleados = ({ datos }) => {
    if (!datos || datos.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-rf-text-3">
                No hay datos de ventas
            </div>
        );
    }

    const formatearDinero = (value) => {
        return `$${value.toLocaleString('es-MX')}`;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datos}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--rf-border)" />
                <XAxis
                    dataKey="nombre"
                    stroke="var(--rf-text-3)"
                    tick={{ fill: 'var(--rf-text-3)', fontSize: 12 }}
                />
                <YAxis
                    stroke="var(--rf-text-3)"
                    tick={{ fill: 'var(--rf-text-3)', fontSize: 12 }}
                    tickFormatter={formatearDinero}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--rf-surface)',
                        border: '1px solid var(--rf-border)',
                        borderRadius: '4px',
                        color: 'var(--rf-text)'
                    }}
                    formatter={(value) => [`${formatearDinero(value)}`, 'Total']}
                    labelFormatter={(label) => `Empleado: ${label}`}
                />
                <Bar dataKey="total" radius={[3, 3, 0, 0]}>
                    {datos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default GraficaVentasEmpleados;