import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Generación de horas (00:00 a 23:30)
const HOURS = [];
for (let h = 0; h < 24; h++) {
  HOURS.push(`${String(h).padStart(2, '0')}:00`);
  HOURS.push(`${String(h).padStart(2, '0')}:30`);
}

export default function ScheduleEditorRow({
  day,
  data,
  dateKey, // Recibimos el dateKey (formato 'yyyy-MM-dd')
  onChange,
}) {
  // Extraemos valores asegurando estados iniciales consistentes
  const working = data?.working ?? true;
  const start = data?.start ?? '08:00';
  const end = data?.end ?? '17:00';

  const update = (changes) => {
    // Retornamos el dateKey para que el componente padre sepa exactamente qué fecha actualizar
    onChange(dateKey, {
      ...data,
      working,
      start,
      end,
      ...changes,
    });
  };

  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/60">
      {/* Fecha (Numérica) */}
      <td className="px-6 py-4 font-medium text-slate-700">
        {format(day, 'dd/MM/yyyy')}
      </td>

      {/* Día de la semana (Texto) */}
      <td className="px-6 py-4 capitalize text-slate-600 font-normal">
        {format(day, 'EEEE', { locale: es })}
      </td>

      {/* Switch de Estado Laboral */}
      <td className="px-6 py-4">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => update({ working: !working })}
            className={`relative h-7 w-14 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
              working ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                working ? 'left-8' : 'left-1'
              }`}
            />
          </button>
        </div>
      </td>

      {/* Selector de Entrada */}
      <td className="px-6 py-4">
        {working ? (
          <select
            value={start}
            onChange={(e) => update({ start: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {HOURS.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-center text-sm font-medium text-slate-400"> — </p>
        )}
      </td>

      {/* Selector de Salida */}
      <td className="px-6 py-4">
        {working ? (
          <select
            value={end}
            onChange={(e) => update({ end: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {HOURS.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-center text-sm font-medium text-slate-400 italic">
            Descanso
          </p>
        )}
      </td>
    </tr>
  );
}
