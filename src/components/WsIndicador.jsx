import { useWsStatus } from '@/hooks/useWsStatus';

const CONFIG = {
    conectado:    { punto: 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]', texto: 'text-emerald-400', label: 'En línea',      pulso: true  },
    reconectando: { punto: 'bg-amber-500',                                          texto: 'text-amber-400',   label: 'Reconectando…', pulso: true  },
    desconectado: { punto: 'bg-red-500',                                            texto: 'text-red-400',     label: 'Sin conexión',  pulso: false },
    error:        { punto: 'bg-red-500',                                            texto: 'text-red-400',     label: 'Sin conexión',  pulso: false },
};

const WsIndicador = () => {
    const estado = useWsStatus();
    const { punto, texto, label, pulso } = CONFIG[estado] ?? CONFIG.desconectado;

    return (
        <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${punto} ${pulso ? 'animate-pulse' : ''}`} />
            <span className={`text-[11px] font-semibold ${texto}`}>{label}</span>
        </div>
    );
};

export default WsIndicador;
