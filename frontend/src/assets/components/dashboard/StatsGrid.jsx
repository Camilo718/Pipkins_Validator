import { useEffect, useState } from 'react';
import { Users, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';
import StatCard from './StatCard';
import apiService from '../../services/api';  

export default function StatsGrid() {
  const [stats, setStats] = useState({
    totalAgents: 0,
    coincidencias: 0,
    diferencias: 0,
    semana: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startDate = startOfWeek.toISOString().split('T')[0];
        const endDate = endOfWeek.toISOString().split('T')[0];

        const summary = await apiService.getSummaryReport(startDate, endDate);
        
        setStats({
          totalAgents: summary.summary?.total_agents || 0,
          coincidencias: summary.summary?.total_attendances || 0,
          diferencias: summary.summary?.total_discrepancies || 0,
          semana: summary.summary?.total_late_minutes || 0,
        });
      } catch (err) {
        console.error('Error al obtener stats:', err);
        setStats({
          totalAgents: 0,
          coincidencias: 0,
          diferencias: 0,
          semana: 0,
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Agentes"
        value={stats.totalAgents}
        icon={<Users className="text-indigo-600" />}
        color="bg-indigo-100"
      />

      <StatCard
        title="Coincidencias"
        value={stats.coincidencias}
        icon={<CheckCircle2 className="text-green-600" />}
        color="bg-green-100"
      />

      <StatCard
        title="Diferencias"
        value={stats.diferencias}
        icon={<AlertTriangle className="text-orange-500" />}
        color="bg-orange-100"
      />

      <StatCard
        title="Semana"
        value={stats.semana}
        icon={<Calendar className="text-blue-600" />}
        color="bg-blue-100"
      />
    </section>
  );
}