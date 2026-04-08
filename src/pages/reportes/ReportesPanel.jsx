import { useReportes } from "@/hooks/useReportes";
import { Loader2, DollarSign, Users, UtensilsCrossed, Package, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import GraficaVentasEmpleados from "./GraficaVentasEmpleados";
import GraficaServicios from "./GraficaServicios";
import GraficaTiposPedido from "./GraficaTiposPedido";

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
        return (
            <div className="text-center py-10 text-slate-400">
                No hay datos disponibles
            </div>
        );
    }

    const formatearDinero = (cantidad) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(cantidad);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Reportes del Día </h1>
                    <p className="text-slate-400">Resumen de ventas y operaciones</p>
                </div>
                <Button
                    onClick={recargar}
                    className="bg-orange-600 hover:bg-orange-700 gap-2"
                >
                    <RefreshCw size={16} />
                    Actualizar
                </Button>
            </div>

            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total General */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-emerald-500/80 text-xs font-bold uppercase tracking-wider mb-1">
                                Total General
                            </p>
                            <h3 className="text-3xl font-black text-white">
                                {formatearDinero(datos.totalGeneral)}
                            </h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-xl">
                            <DollarSign size={24} className="text-emerald-500" />
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 text-emerald-500/5 rotate-12">
                        <DollarSign size={120} />
                    </div>
                </div>

                {/* Total Desayuno */}
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-amber-500/80 text-xs font-bold uppercase tracking-wider mb-1">
                                Desayuno
                            </p>
                            <h3 className="text-3xl font-black text-white">
                                {formatearDinero(datos.totalDesayuno)}
                            </h3>
                        </div>
                        <div className="p-3 bg-amber-500/10 rounded-xl">
                            <UtensilsCrossed size={24} className="text-amber-500" />
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 text-amber-500/5 rotate-12">
                        <UtensilsCrossed size={120} />
                    </div>
                </div>

                {/* Total Comida */}
                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-orange-500/80 text-xs font-bold uppercase tracking-wider mb-1">
                                Comida
                            </p>
                            <h3 className="text-3xl font-black text-white">
                                {formatearDinero(datos.totalComida)}
                            </h3>
                        </div>
                        <div className="p-3 bg-orange-500/10 rounded-xl">
                            <UtensilsCrossed size={24} className="text-orange-500" />
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 text-orange-500/5 rotate-12">
                        <UtensilsCrossed size={120} />
                    </div>
                </div>

                {/* Total Platillos - CAMBIO AQUÍ */}
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-blue-500/80 text-xs font-bold uppercase tracking-wider mb-1">
                                Total Platillos
                            </p>
                            <h3 className="text-3xl font-black text-white">
                                {datos.totalPlatillosLoza + datos.totalPlatillosParaLlevar}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                {datos.totalPlatillosLoza} loza • {datos.totalPlatillosParaLlevar} llevar
                            </p>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Package size={24} className="text-blue-500" />
                        </div>
                    </div>
                    <div className="absolute -right-6 -bottom-6 text-blue-500/5 rotate-12">
                        <Package size={120} />
                    </div>
                </div>
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ventas por Empleado */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Users size={20} className="text-orange-500" />
                        Ventas por Empleado
                    </h3>
                    <GraficaVentasEmpleados datos={datos.ventaEmpleados} />
                </div>

                {/* Desayuno vs Comida */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <UtensilsCrossed size={20} className="text-orange-500" />
                        Distribución de Servicios
                    </h3>
                    <GraficaServicios
                        desayuno={datos.totalDesayuno}
                        comida={datos.totalComida}
                    />
                </div>
            </div>

            {/* Gráfica de Tipos de Pedido - CAMBIO AQUÍ */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Package size={20} className="text-orange-500" />
                    Platillos por Tipo
                </h3>
                <GraficaTiposPedido
                    loza={datos.totalPlatillosLoza}
                    paraLlevar={datos.totalPlatillosParaLlevar}
                />
            </div>
        </div>
    );
};

export default ReportesPanel;