import { useState } from 'react';
import Button from '../iu/Button';

const HOURS = [];
for (let h = 0; h < 24; h++) {
  HOURS.push(`${String(h).padStart(2, '0')}:00`);
  HOURS.push(`${String(h).padStart(2, '0')}:30`);
}

export default function QuickSchedule({
  schedule = {}, // Por defecto inicializado como objeto
  setSchedule,
}) {
  const [start, setStart] = useState('08:00');
  const [end, setEnd] = useState('17:00');

  const dateKeys = Object.keys(schedule);
  const hasDays = dateKeys.length > 0;

  const applySchedule = () => {
    if (!hasDays) return;

    // Reducimos el objeto original aplicando los nuevos horarios sobre cada fecha
    const updated = dateKeys.reduce((acc, dateKey) => {
      const dayData = schedule[dateKey];
      acc[dateKey] = {
        ...dayData,
        // Si el día está marcado como descanso (working === false), mantenemos esa propiedad intacta.
        // Solo sobrescribimos las horas si está activo, o hereda true por defecto.
        working: dayData?.working ?? true,
        start,
        end,
      };
      return acc;
    }, {});

    setSchedule(updated);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-slate-800 flex items-center gap-2">
        <span>⚡</span> Configuración rápida
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Hora entrada
          </label>
          <select
            value={start}
            disabled={!hasDays}
            onChange={(e) => setStart(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 focus:border-indigo-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 transition-colors"
          >
            {HOURS.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Hora salida
          </label>
          <select
            value={end}
            disabled={!hasDays}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 focus:border-indigo-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 transition-colors"
          >
            {HOURS.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <Button
            type="button"
            onClick={applySchedule}
            disabled={!hasDays}
            className="w-full py-3"
          >
            Aplicar horario
          </Button>
        </div>
      </div>

      <p className={`mt-5 text-xs transition-colors ${
        hasDays ? 'text-slate-500' : 'text-amber-600 font-medium'
      }`}>
        {hasDays 
          ? "Este horario se aplicará a todos los días generados en el período seleccionado."
          : "⚠️ Debes definir un rango de fechas arriba para poder usar la configuración rápida."}
      </p>
    </section>
  );
}