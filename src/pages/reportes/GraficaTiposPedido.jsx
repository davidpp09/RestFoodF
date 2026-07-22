import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-rf-surface border border-rf-border rounded-md p-3 shadow-rf-lg">
                <p className="text-rf-text font-semibold">{payload[0].name}</p>
                <p className="text-rf-accent-ink font-bold text-lg font-mono">
                    {payload[0].value} platillos
                </p>
            </div>
        );
    }
    return null;
};

const renderCustomLabel = (entry) => {
    return `${entry.name}: ${entry.value}`;
};

const GraficaTiposPedido = ({ loza, paraLlevar }) => {
    const datos = [
        { name: 'En Loza', value: loza, color: 'var(--rf-blue)' },
        { name: 'Para Llevar', value: paraLlevar, color: 'var(--rf-green)' }
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={datos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={100}
                    innerRadius={60}
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

export default GraficaTiposPedido;