import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

export default function CalendarRangePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const formatRange = () => {
    if (!value?.from) return 'Seleccionar período';

    if (!value.to) {
      return format(value.from, 'dd MMM yyyy', { locale: es });
    }

    return `${format(value.from, 'dd MMM yyyy', { locale: es })} → ${format(value.to, 'dd MMM yyyy', { locale: es })}`;
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Calendar size={20} className="text-indigo-900" />
        <h3 className="text-lg font-semibold text-slate-800">
          Rango de fechas
        </h3>
      </div>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 text-left transition hover:border-indigo-400"
      >
        <span className="text-sm font-medium text-slate-700">
          {formatRange()}
        </span>
        <Calendar size={18} className="text-slate-500" />
      </button>

      {open && (
        <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-4 shadow-xl">
          <DayPicker
            mode="range"
            locale={es}
            selected={value}
            onSelect={(range) => {
              onChange?.(range);
              if (range?.from && range?.to) {
                setOpen(false);
              }
            }}
          />
        </div>
      )}
    </section>
  );
}
