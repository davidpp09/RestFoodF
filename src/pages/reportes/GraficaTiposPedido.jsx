import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const GraficaTiposPedido = ({ loza, paraLlevar }) => {
    const datos = [
        { name: 'En Loza', value: loza, color: '#3b82f6' },
        { name: 'Para Llevar', value: paraLlevar, color: '#10b981' }
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
                    <p className="text-white font-semibold">{payload[0].name}</p>
                    <p className="text-orange-500 font-bold text-lg">
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
                    wrapperStyle={{ color: '#94a3b8' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default GraficaTiposPedido;