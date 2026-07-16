import React, { forwardRef } from 'react';
import { UtensilsCrossed } from 'lucide-react';

const MesaCard = forwardRef(({ mesa, idOrden, ...props }, ref) => {
    const esOcupada = mesa.estado === "OCUPADA";
    const activa = esOcupada || idOrden;

    return (
        <div ref={ref} {...props} className={`
            cursor-pointer px-4 py-3.5 rounded-md border transition-all duration-200 h-32
            flex flex-col justify-between active:scale-[.985]
            ${activa
                ? "bg-rf-surface border-rf-border border-l-[3px] border-l-rf-red shadow-rf-sm"
                : "bg-rf-surface-2 border-rf-border"}
        `}>
            <div className="flex justify-between items-center">
                <span className={`text-[15px] font-bold tracking-[.04em] font-mono ${activa ? "text-rf-text" : "text-rf-text-3"}`}>
                    MESA {mesa.numero}
                </span>
                {activa && (
                    <span className="inline-flex items-center h-[22px] px-2 rounded-[3px] bg-rf-red-soft text-rf-red-ink text-[11px] font-bold tracking-[.06em]">
                        OCUPADA
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-1">
                {idOrden ? (
                    <div className="flex items-center gap-2 text-rf-text-3 font-mono">
                        <UtensilsCrossed size={13} />
                        <span className="text-xs">ORD #{idOrden}</span>
                    </div>
                ) : (
                    !esOcupada && (
                        <span className="text-[11px] font-bold tracking-[.12em] text-rf-green-ink">LIBRE</span>
                    )
                )}
            </div>
        </div>
    );
});

MesaCard.displayName = "MesaCard";
export default MesaCard;
