import { Calendar } from 'lucide-react';

export default function WeekSelector() {
  const getCurrentWeekData = () => {
    const now = new Date();
    
    // Calcular inicio de semana (lunes)
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Calcular fin de semana (DOMINGO - 6 días después del lunes)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // ✅ CAMBIO: +6 en lugar de +4
    endOfWeek.setHours(23, 59, 59, 999);
    
    // Calcular número de semana
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(
      ((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7
    );
    
    // Formatear fechas
    const options = { month: 'short', day: 'numeric' };
    const startDateStr = startOfWeek.toLocaleDateString('en-US', options);
    const endDateStr = endOfWeek.toLocaleDateString('en-US', options);
    
    return {
      startDate: startOfWeek,
      endDate: endOfWeek,
      startDateStr,
      endDateStr,
      weekNumber,
      year: now.getFullYear()
    };
  };

  const weekData = getCurrentWeekData();

  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-2">
      <Calendar size={18} className="text-slate-600" />
      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400">
          Week {weekData.weekNumber}
        </p>
        <h2 className="text-base font-semibold text-slate-800">
          {weekData.startDateStr} - {weekData.endDateStr}, {weekData.year}
        </h2>
      </div>
    </div>
  );
}