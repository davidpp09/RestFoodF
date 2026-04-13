import { useMesasSala } from '../hooks/useMesasSala';
import MesaAdmin from '../components/MesaAdmin';
import StatCard from '../components/StatCard';
import { CheckCircle2, Clock, Utensils } from 'lucide-react';

const AdminPanel = () => {
    const { mesas, stats } = useMesasSala();

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <StatCard color="blue"    label="Total"    value={stats.total}   icon={Utensils}      />
                <StatCard color="red"     label="Ocupadas" value={stats.ocupadas} icon={Clock}         />
                <StatCard color="emerald" label="Libres"   value={stats.libres}  icon={CheckCircle2}  />
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5 content-start pb-10">
                {mesas.map((mesa) => (
                    <MesaAdmin key={mesa.id_mesa} {...mesa} />
                ))}
            </div>
        </>
    );
};

export default AdminPanel;
