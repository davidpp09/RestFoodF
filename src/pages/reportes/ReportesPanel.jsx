import { useReportes } from '@/hooks/useReportes';
import { Loader2, DollarSign, Users, UtensilsCrossed, Package, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatearDinero } from '@/lib/utils';
import StatCard from '@/components/StatCard';
import GraficaVentasEmpleados from './GraficaVentasEmpleados';
import GraficaServicios from './GraficaServicios';
import GraficaTiposPedido from './GraficaTiposPedido';

const ReportesPanel = () => {
    const { datos, loading, recargar } = useReportes();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-slate-900 rounded-xl border border-slate-800">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                <p className="text-slate-400 font-medium">Cargando reportes...</p>
            </div>
        );
    }

    if (!datos) {
        return <div className="text-center py-10 text-slate-400">No hay datos disponibles</div>;
    }

    const totalPlatillos = datos.totalPlatillosLoza + datos.totalPlatillosParaLlevar;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Reportes del Día</h1>
                    <p className="text-slate-400">Resumen de ventas y operaciones</p>
                </div>
                <Button onClick={recargar} className="bg-orange-600 hover:bg-orange-700 gap-2">
                    <RefreshCw size={16} />
                    Actualizar
                </Button>
            </div>

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
        </div>
    );
};

export default ReportesPanel;
