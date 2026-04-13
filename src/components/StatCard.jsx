const COLORES = {
    blue:    { gradiente: 'from-blue-500/10 to-blue-600/5',       borde: 'border-blue-500/20',       etiqueta: 'text-blue-500/80',       icono: 'text-blue-500',       iconoBg: 'bg-blue-500/10',       fantasma: 'text-blue-500/5'    },
    red:     { gradiente: 'from-red-500/10 to-red-600/5',         borde: 'border-red-500/20',         etiqueta: 'text-red-500/80',         icono: 'text-red-500',         iconoBg: 'bg-red-500/10',         fantasma: 'text-red-500/5'     },
    emerald: { gradiente: 'from-emerald-500/10 to-emerald-600/5', borde: 'border-emerald-500/20',     etiqueta: 'text-emerald-500/80',     icono: 'text-emerald-500',     iconoBg: 'bg-emerald-500/10',     fantasma: 'text-emerald-500/5' },
    amber:   { gradiente: 'from-amber-500/10 to-amber-600/5',     borde: 'border-amber-500/20',       etiqueta: 'text-amber-500/80',       icono: 'text-amber-500',       iconoBg: 'bg-amber-500/10',       fantasma: 'text-amber-500/5'   },
    orange:  { gradiente: 'from-orange-500/10 to-orange-600/5',   borde: 'border-orange-500/20',      etiqueta: 'text-orange-500/80',      icono: 'text-orange-500',      iconoBg: 'bg-orange-500/10',      fantasma: 'text-orange-500/5'  },
};

const StatCard = ({ color, label, value, icon: Icon, subtitulo }) => {
    const c = COLORES[color];
    return (
        <div className={`bg-gradient-to-br ${c.gradiente} border ${c.borde} rounded-2xl p-6 relative overflow-hidden`}>
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className={`${c.etiqueta} text-xs font-bold uppercase tracking-wider mb-1`}>{label}</p>
                    <h3 className="text-3xl font-black text-white">{value}</h3>
                    {subtitulo && <p className="text-xs text-slate-400 mt-1">{subtitulo}</p>}
                </div>
                <div className={`p-3 ${c.iconoBg} rounded-xl`}>
                    <Icon size={24} className={c.icono} />
                </div>
            </div>
            <div className={`absolute -right-6 -bottom-6 ${c.fantasma} rotate-12`}>
                <Icon size={120} />
            </div>
        </div>
    );
};

export default StatCard;
