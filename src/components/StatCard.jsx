const COLORES = {
    blue:    'text-rf-blue',
    red:     'text-rf-red',
    emerald: 'text-rf-green',
    amber:   'text-rf-accent',
    orange:  'text-rf-accent',
};

const StatCard = ({ color, label, value, icon, subtitulo, grande = false }) => {
    const Icon = icon;
    const icono = COLORES[color] ?? 'text-rf-text-2';
    return (
        <div className={`flex items-center gap-3.5 ${grande ? 'p-4' : 'p-3.5'} rounded-lg bg-rf-surface border border-rf-border shadow-rf-sm`}>
            <div className={`flex ${grande ? 'size-11' : 'size-10'} shrink-0 items-center justify-center rounded-md bg-rf-surface-2 ${icono}`}>
                <Icon size={grande ? 24 : 20} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
                <span className={`${grande ? 'text-3xl' : 'text-2xl'} font-bold leading-none tracking-tight font-mono text-rf-text`}>{value}</span>
                <span className="text-[11.5px] font-semibold uppercase tracking-[.1em] text-rf-text-3 truncate">{label}</span>
                {subtitulo && <span className="text-xs text-rf-text-3 truncate">{subtitulo}</span>}
            </div>
        </div>
    );
};

export default StatCard;
