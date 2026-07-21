import { useState, useEffect } from 'react';
import { useComandas } from '@/hooks/useComandas';
import { Loader2, RefreshCw, ClipboardList, Bike, Utensils, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatearDinero } from '@/lib/utils';
import ComandaCard from '@/components/ComandaCard';

const PERIODOS = [
    { label: 'Hoy',  value: 'hoy' },
    { label: 'Ayer', value: 'ayer' },
];

const ROL_META = {
    MESERO:     { label: 'Mesero',     icono: Utensils },
    REPARTIDOR: { label: 'Repartidor', icono: Bike },
};

const metaRol = (rol) => ROL_META[rol] ?? { label: rol?.charAt(0) + rol?.slice(1).toLowerCase(), icono: User };

const ComandasPanel = () => {
    const { empleados, loading, fecha, setFecha, aplicarPeriodo, recargar } = useComandas();
    const [seleccionado, setSeleccionado] = useState(null);

    // Mantener una selección válida cuando cambian los datos (fecha/recarga)
    useEffect(() => {
        if (empleados.length === 0) { setSeleccionado(null); return; }
        setSeleccionado((prev) =>
            prev && empleados.some((e) => e.id_usuario === prev) ? prev : empleados[0].id_usuario
        );
    }, [empleados]);

    const empleadoActivo = empleados.find((e) => e.id_usuario === seleccionado) ?? null;

    return (
        <div className="space-y-6">
            {/* Encabezado + controles de fecha */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-rf-text">Comandas por empleado</h1>
                    <p className="text-rf-text-2">Revisa una por una las órdenes que capturó cada quien</p>
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
                    <p className="text-rf-text-2 font-medium">Cargando comandas...</p>
                </div>
            ) : empleados.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-rf-surface rounded-lg border border-rf-border gap-3">
                    <ClipboardList size={36} className="text-rf-text-3" />
                    <p className="text-rf-text-2 font-medium">Sin comandas en esta fecha</p>
                </div>
            ) : (
                <>
                    {/* Selector de empleado (chips) */}
                    <div className="flex flex-wrap gap-2">
                        {empleados.map((emp) => {
                            const { label, icono: Icono } = metaRol(emp.rol);
                            const activo = emp.id_usuario === seleccionado;
                            return (
                                <button
                                    key={emp.id_usuario}
                                    onClick={() => setSeleccionado(emp.id_usuario)}
                                    className={`flex items-center gap-2 pl-3 pr-3.5 py-2 rounded-md border text-sm font-bold transition-colors
                                        ${activo
                                            ? 'bg-rf-accent border-rf-accent text-white shadow-rf-sm'
                                            : 'bg-rf-surface border-rf-border-strong text-rf-text-2 hover:bg-rf-surface-2'}`}
                                    title={label}
                                >
                                    <Icono size={15} className="shrink-0" />
                                    <span>{emp.nombre}</span>
                                    <span className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold font-mono
                                        ${activo ? 'bg-white/25 text-white' : 'bg-rf-surface-2 text-rf-text-3'}`}>
                                        {emp.ordenes.length}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Órdenes del empleado seleccionado */}
                    {empleadoActivo && (
                        <div className="bg-rf-surface border border-rf-border rounded-lg p-5 sm:p-6 shadow-rf-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-rf-border">
                                <div className="flex items-center gap-2.5">
                                    {(() => { const { label, icono: Icono } = metaRol(empleadoActivo.rol); return (
                                        <>
                                            <div className="p-2 rounded-md bg-rf-accent-soft text-rf-accent-ink">
                                                <Icono size={18} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-rf-text leading-tight">{empleadoActivo.nombre}</h3>
                                                <p className="text-xs text-rf-text-3 font-semibold uppercase tracking-wide">{label}</p>
                                            </div>
                                        </>
                                    ); })()}
                                </div>
                                <div className="flex items-center gap-5 text-right">
                                    <div>
                                        <p className="text-xs font-bold text-rf-text-3 uppercase tracking-wide">Comandas</p>
                                        <p className="text-xl font-bold font-mono text-rf-text">{empleadoActivo.ordenes.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-rf-text-3 uppercase tracking-wide">Total</p>
                                        <p className="text-xl font-bold font-mono text-rf-text">{formatearDinero(empleadoActivo.totalVendido)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5 content-start">
                                {empleadoActivo.ordenes.map((orden) => (
                                    <ComandaCard key={orden.id_orden} orden={orden} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ComandasPanel;
