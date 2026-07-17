import ScheduleRow from './ScheduleRow';

export default function ScheduleTable({ agents = [], onEdit, onDelete }) {
  const getWeekDays = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    
    const monday = new Date(now);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    
    const days = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < 7; i++) { // ✅ 7 días (Lunes a Domingo)
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);
      
      days.push({
        name: dayNames[i],
        date: currentDate.getDate(),
        fullDate: currentDate
      });
    }
    
    return days;
  };

  const weekDays = getWeekDays();

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-lg">
      <div className="mb-4 grid grid-cols-[260px_repeat(7,1fr)_80px] gap-4 px-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Agent
        </div>
        {weekDays.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {day.name}
            </div>
            <div className="text-lg font-bold text-slate-800">
              {day.date}
            </div>
          </div>
        ))}
        <div className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
          Actions
        </div>
      </div>

      <div className="space-y-2">
        {agents.map((agent) => (
          <ScheduleRow
            key={agent.id}
            agent={agent}
            onEdit={() => onEdit?.(agent)}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}