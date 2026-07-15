import { Users, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';

import StatCard from './StatCard';

export default function StatsGrid() {
  return (
    <section
      className="
                grid
                gap-6
                md:grid-cols-2
                xl:grid-cols-4
            "
    >
      <StatCard
        title="Agentes"
        value="18"
        icon={<Users className="text-indigo-600" />}
        color="bg-indigo-100"
      />

      <StatCard
        title="Coincidencias"
        value="14"
        icon={<CheckCircle2 className="text-green-600" />}
        color="bg-green-100"
      />

      <StatCard
        title="Diferencias"
        value="4"
        icon={<AlertTriangle className="text-orange-500" />}
        color="bg-orange-100"
      />

      <StatCard
        title="Semana"
        value="29"
        icon={<Calendar className="text-blue-600" />}
        color="bg-blue-100"
      />
    </section>
  );
}
