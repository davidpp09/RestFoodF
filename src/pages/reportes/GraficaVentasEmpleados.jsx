import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORES = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b'];

const GraficaVentasEmpleados = ({ datos }) => {
    if (!datos || datos.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-slate-500">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                    dataKey="nombre" 
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis 
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickFormatter={formatearDinero}
                />
                <Tooltip 
                    contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#fff'
                    }}
                    formatter={(value) => [`${formatearDinero(value)}`, 'Total']}
                    labelFormatter={(label) => `Empleado: ${label}`}
                />
                <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                    {datos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default GraficaVentasEmpleados;