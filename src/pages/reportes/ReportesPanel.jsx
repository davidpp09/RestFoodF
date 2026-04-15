import { useReportes } from '@/hooks/useReportes';
import { Loader2, DollarSign, Users, UtensilsCrossed, Package, RefreshCw, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatearDinero } from '@/lib/utils';
import StatCard from '@/components/StatCard';
import GraficaVentasEmpleados from './GraficaVentasEmpleados';
import GraficaServicios from './GraficaServicios';
import GraficaTiposPedido from './GraficaTiposPedido';

const PERIODOS = [
    { label: 'Hoy',  value: 'hoy' },
    { label: 'Ayer', value: 'ayer' },
];

const ReportesPanel = () => {
    const { datos, cancelaciones, loading, fecha, setFecha, aplicarPeriodo, recargar } = useReportes();

    const totalPlatillos = datos
        ? datos.totalPlatillosLoza + datos.totalPlatillosParaLlevar
        : 0;

    return (
        <div className="space-y-6">
            {/* Encabezado + controles de fecha */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Reportes</h1>
                    <p className="text-slate-400">Resumen de ventas y operaciones</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {PERIODOS.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => aplicarPeriodo(p.value)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
                        >
                            {p.label}
                        </button>
                    ))}
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 outline-none focus:border-orange-500"
                    />
                    <Button onClick={recargar} size="sm" className="bg-orange-600 hover:bg-orange-700 gap-2">
                        <RefreshCw size={14} />
                        Actualizar
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 bg-slate-900 rounded-xl border border-slate-800">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                    <p className="text-slate-400 font-medium">Cargando reportes...</p>
                </div>
            ) : !datos ? (
                <div className="text-center py-10 text-slate-400">No hay datos disponibles</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard color="emerald" label="Total General" value={formatearDinero(datos.totalGeneral)} icon={DollarSign} />
                        <StatCard color="amber" label="Desayuno" value={formatearDinero(datos.totalDesayuno)} icon={UtensilsCrossed} />
                        <StatCard color="orange" label="Comida" value={formatearDinero(datos.totalComida)} icon={UtensilsCrossed} />
                        <StatCard
                            color="blue"
                            label="Total Platillos"
                            value={totalPlatillos}
                            icon={Package}
                            subtitulo={`${datos.totalPlatillosLoza} loza • ${datos.totalPlatillosParaLlevar} llevar`}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Users size={20} className="text-orange-500" />
                                Ventas por Empleado
                            </h3>
                            <GraficaVentasEmpleados datos={datos.ventaEmpleados} />
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <UtensilsCrossed size={20} className="text-orange-500" />
                                Distribución de Servicios
                            </h3>
                            <GraficaServicios desayuno={datos.totalDesayuno} comida={datos.totalComida} />
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Package size={20} className="text-orange-500" />
                            Platillos por Tipo
                        </h3>
                        <GraficaTiposPedido loza={datos.totalPlatillosLoza} paraLlevar={datos.totalPlatillosParaLlevar} />
                    </div>

                    {/* Cancelaciones por mesero */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <XCircle size={20} className="text-red-500" />
                            Cancelaciones por Mesero
                        </h3>
                        {cancelaciones.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-4">Sin cancelaciones este día</p>
                        ) : (
                            <div className="space-y-4">
                                {cancelaciones.map((mesero) => (
                                    <div key={mesero.nombreMesero} className="border border-slate-700 rounded-xl overflow-hidden">
                                        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50">
                                            <span className="font-bold text-white">{mesero.nombreMesero}</span>
                                            <span className="text-sm font-mono bg-red-500/10 text-red-400 px-2 py-0.5 rounded-lg">
                                                {mesero.totalCancelaciones} cancelación{mesero.totalCancelaciones !== 1 ? 'es' : ''}
                                            </span>
                                        </div>
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-slate-500 text-xs uppercase border-b border-slate-700">
                                                    <th className="text-left px-4 py-2">Platillo</th>
                                                    <th className="text-right px-4 py-2">Veces</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {mesero.productos.map((p) => (
                                                    <tr key={p.nombreProducto} className="border-b border-slate-800 last:border-0">
                                                        <td className="px-4 py-2 text-slate-300">{p.nombreProducto}</td>
                                                        <td className="px-4 py-2 text-right text-red-400 font-mono">{p.veces}x</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ReportesPanel;
