import { useWsStatus } from '@/hooks/useWsStatus';

const CONFIG = {
    conectado:    { punto: 'bg-rf-green', chip: 'bg-rf-green-soft text-rf-green-ink', label: 'En vivo',       pulso: false },
    reconectando: { punto: 'bg-rf-accent', chip: 'bg-rf-accent-soft text-rf-accent-ink', label: 'Reconectando…', pulso: true },
    desconectado: { punto: 'bg-rf-red',   chip: 'bg-rf-red-soft text-rf-red-ink',     label: 'Sin conexión',  pulso: false },
    error:        { punto: 'bg-rf-red',   chip: 'bg-rf-red-soft text-rf-red-ink',     label: 'Sin conexión',  pulso: false },
};

const WsIndicador = () => {
    const estado = useWsStatus();
    const { punto, chip, label, pulso } = CONFIG[estado] ?? CONFIG.desconectado;

    return (
        <span className={`inline-flex items-center gap-2 h-8 px-3 rounded-[3px] text-xs font-bold ${chip}`}>
            <span className={`w-2 h-2 rounded-full ${punto} ${pulso ? 'animate-pulse' : ''}`} />
            {label}
        </span>
    );
};

export default WsIndicador;
