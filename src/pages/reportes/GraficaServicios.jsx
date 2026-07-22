import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const formatearDinero = (value) => {
    return `$${value.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-rf-surface border border-rf-border rounded-md p-3 shadow-rf-lg">
                <p className="text-rf-text font-semibold">{payload[0].name}</p>
                <p className="text-rf-accent-ink font-bold text-lg font-mono">
                    {formatearDinero(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

const GraficaServicios = ({ desayuno, comida }) => {
    const datos = [
        { name: 'Desayuno', value: parseFloat(desayuno), color: 'var(--rf-accent)' },
        { name: 'Comida', value: parseFloat(comida), color: 'var(--rf-cyan)' }
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={datos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${formatearDinero(entry.value)}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {datos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    iconType="circle"
                    wrapperStyle={{ color: 'var(--rf-text-2)' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default GraficaServicios;