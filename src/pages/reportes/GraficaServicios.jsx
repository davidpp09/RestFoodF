import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const GraficaServicios = ({ desayuno, comida }) => {
    const datos = [
        { name: 'Desayuno', value: parseFloat(desayuno), color: '#f59e0b' },
        { name: 'Comida', value: parseFloat(comida), color: '#f97316' }
    ];

    const formatearDinero = (value) => {
        return `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
                    <p className="text-white font-semibold">{payload[0].name}</p>
                    <p className="text-orange-500 font-bold text-lg">
                        {formatearDinero(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

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
                    wrapperStyle={{ color: '#94a3b8' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default GraficaServicios;