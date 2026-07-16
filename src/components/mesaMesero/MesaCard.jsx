import React, { forwardRef } from 'react';
import { UtensilsCrossed } from 'lucide-react';

const MesaCard = forwardRef(({ mesa, idOrden, ...props }, ref) => {
    const esOcupada = mesa.estado === "OCUPADA";
    const activa = esOcupada || idOrden;

    return (
        <div ref={ref} {...props} className={`
            cursor-pointer px-4 py-3.5 rounded-md border transition-all duration-200 h-32
            flex flex-col justify-between active:scale-[.985] overflow-hidden
            ${activa
                ? "bg-rf-surface border-rf-border border-l-[3px] border-l-rf-red shadow-rf-sm"
                : "bg-rf-surface-2 border-rf-border"}
        `}>
            {/* En tablets angostas la tarjeta mide ~140px: el número va solo en su
                renglón y la etiqueta de estado abajo, para que nada se desborde */}
            <span className={`text-[15px] font-bold tracking-[.04em] font-mono truncate ${activa ? "text-rf-text" : "text-rf-text-3"}`}>
                MESA {mesa.numero}
            </span>

            <div className="flex flex-col items-start gap-1.5">
                {idOrden && (
                    <div className="flex items-center gap-1.5 text-rf-text-3 font-mono">
                        <UtensilsCrossed size={13} className="shrink-0" />
                        <span className="text-xs truncate">ORD #{idOrden}</span>
                    </div>
                )}
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
