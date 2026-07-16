import { eachDayOfInterval, format } from 'date-fns';
import ScheduleEditorRow from './ScheduleEditorRow';

export default function ScheduleEditorTable({
  range,
  schedule = {},
  onChange,
}) {
  if (!range?.from || !range?.to) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center text-slate-500">
        Selecciona un período para generar el horario.
      </div>
    );
  }

  // Generamos los días del intervalo
  const days = eachDayOfInterval({
    start: range.from,
    end: range.to,
  });

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Fecha
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Día
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Trabaja
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Entrada
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Salida
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {days.map((day) => {
              // Formateamos la fecha a formato ISO básico YYYY-MM-DD para buscar de forma segura en el estado
              const dateKey = format(day, 'yyyy-MM-dd');
              // Intentamos buscar el horario por su clave de fecha.
              // Si tu 'schedule' es un array, se puede usar: schedule.find(item => item.date === dateKey)
              const dayData = schedule[dateKey] || {
                isActive: false,
                checkIn: '08:00',
                checkOut: '17:00',
            };

              return (
                <ScheduleEditorRow
                  key={dateKey}
                  day={day}
                  data={dayData}
                  dateKey={dateKey} // Es más descriptivo pasar una clave de fecha que un índice numérico
                  onChange={onChange}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
