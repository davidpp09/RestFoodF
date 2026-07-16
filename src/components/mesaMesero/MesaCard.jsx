import React, { forwardRef } from 'react';
import { listaTiemposGuardados } from '../../hooks/useTiempos';

const MesaCard = forwardRef(({ mesa, idOrden, ...props }, ref) => {
    const esOcupada = mesa.estado === "OCUPADA";
    const activa = esOcupada || idOrden;
    // Tiempos marcados para la orden de esta mesa (guardados en la tablet),
    // visibles en el mapa aunque el pedido aún no se haya enviado
    const tiempos = idOrden ? listaTiemposGuardados(idOrden) : [];

    return (
        <div ref={ref} {...props} className={`
            cursor-pointer px-4 py-3.5 rounded-md border transition-all duration-200 min-h-32
            flex flex-col gap-2 active:scale-[.985]
            ${activa
                ? "bg-rf-surface border-rf-border border-l-[3px] border-l-rf-red shadow-rf-sm"
                : "bg-rf-surface-2 border-rf-border"}
        `}>
            <span className={`text-[15px] font-bold tracking-[.04em] font-mono truncate ${activa ? "text-rf-text" : "text-rf-text-3"}`}>
                MESA {mesa.numero}
            </span>

            {/* Tiempos de la orden, uno por línea */}
            {tiempos.length > 0 && (
                <div className="flex flex-col gap-0.5">
                    {tiempos.map((t) => (
                        <span key={t} className="text-[11px] font-semibold leading-tight text-rf-accent-ink">{t}</span>
                    ))}
                </div>
            )}

            <div className="mt-auto">
                {activa ? (
                    <span className="inline-flex items-center h-[22px] px-2 rounded-[3px] bg-rf-red-soft text-rf-red-ink text-[11px] font-bold tracking-[.06em] whitespace-nowrap">
                        OCUPADA
                    </span>
                ) : (
                    <span className="text-[11px] font-bold tracking-[.12em] text-rf-green-ink">LIBRE</span>
                )}
            </div>
        </div>
    );
});

MesaCard.displayName = "MesaCard";
export default MesaCard;
