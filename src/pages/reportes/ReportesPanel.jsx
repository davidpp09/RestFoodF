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
                    <h1 className="text-2xl font-bold text-rf-text">Reportes</h1>
                    <p className="text-rf-text-2">Resumen de ventas y operaciones</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {PERIODOS.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => aplicarPeriodo(p.value)}
                            className="px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide border border-rf-border-strong hover:bg-rf-surface-2 text-rf-text-2 transition-colors"
                        >
                            {p.label}
                        </button>
                    ))}
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="bg-rf-surface border border-rf-border-strong text-rf-text-2 text-xs rounded-md px-2 py-1.5 outline-none focus:border-rf-accent"
                    />
                    <Button onClick={recargar} size="sm" className="bg-rf-accent hover:bg-rf-accent-strong gap-2">
                        <RefreshCw size={14} />
                        Actualizar
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 bg-rf-surface rounded-lg border border-rf-border">
                    <Loader2 className="w-10 h-10 text-rf-accent animate-spin mb-4" />
                    <p className="text-rf-text-2 font-medium">Cargando reportes...</p>
                </div>
            ) : !datos ? (
                <div className="text-center py-10 text-rf-text-2">No hay datos disponibles</div>
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
                        <div className="bg-rf-surface border border-rf-border rounded-lg p-6 shadow-rf-sm">
                            <h3 className="text-lg font-bold text-rf-text mb-4 flex items-center gap-2">
                                <Users size={20} className="text-rf-accent" />
                                Ventas por Empleado
                            </h3>
                            <GraficaVentasEmpleados datos={datos.ventaEmpleados} />
                        </div>

                        <div className="bg-rf-surface border border-rf-border rounded-lg p-6 shadow-rf-sm">
                            <h3 className="text-lg font-bold text-rf-text mb-4 flex items-center gap-2">
                                <UtensilsCrossed size={20} className="text-rf-accent" />
                                Distribución de Servicios
                            </h3>
                            <GraficaServicios desayuno={datos.totalDesayuno} comida={datos.totalComida} />
                        </div>
                    </div>

                    <div className="bg-rf-surface border border-rf-border rounded-lg p-6 shadow-rf-sm">
                        <h3 className="text-lg font-bold text-rf-text mb-4 flex items-center gap-2">
                            <Package size={20} className="text-rf-accent" />
                            Platillos por Tipo
                        </h3>
                        <GraficaTiposPedido loza={datos.totalPlatillosLoza} paraLlevar={datos.totalPlatillosParaLlevar} />
                    </div>

                    {/* Cancelaciones por mesero */}
                    <div className="bg-rf-surface border border-rf-border rounded-lg p-6 shadow-rf-sm">
                        <h3 className="text-lg font-bold text-rf-text mb-4 flex items-center gap-2">
                            <XCircle size={20} className="text-rf-red" />
                            Cancelaciones por Mesero
                        </h3>
                        {cancelaciones.length === 0 ? (
                            <p className="text-rf-text-3 text-sm text-center py-4">Sin cancelaciones este día</p>
                        ) : (
                            <div className="space-y-4">
                                {cancelaciones.map((mesero) => (
                                    <div key={mesero.nombreMesero} className="border border-rf-border rounded-md overflow-hidden">
                                        <div className="flex items-center justify-between px-4 py-3 bg-rf-surface-2">
                                            <span className="font-bold text-rf-text">{mesero.nombreMesero}</span>
                                            <span className="text-sm font-mono bg-rf-red-soft text-rf-red-ink px-2 py-0.5 rounded-[3px]">
                                                {mesero.totalCancelaciones} cancelación{mesero.totalCancelaciones !== 1 ? 'es' : ''}
                                            </span>
                                        </div>
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-rf-text-3 text-xs uppercase border-b border-rf-border">
                                                    <th className="text-left px-4 py-2">Platillo</th>
                                                    <th className="text-right px-4 py-2">Veces</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {mesero.productos.map((p) => (
                                                    <tr key={p.nombreProducto} className="border-b border-rf-border last:border-0">
                                                        <td className="px-4 py-2 text-rf-text-2">{p.nombreProducto}</td>
                                                        <td className="px-4 py-2 text-right text-rf-red-ink font-mono">{p.veces}x</td>
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
