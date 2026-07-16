import { CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const options = [
  { id: 'week', label: 'Semana' },
  { id: 'biweekly', label: 'Quincena' },
  { id: 'month', label: 'Mes' },
];

export default function PeriodSelector({ value, onChange }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <CalendarDays size={20} className="text-indigo-600" />
        <h3 className="text-lg font-semibold text-slate-800">Período</h3>
      </div>

      <div className="relative z-0 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const isSelected = value === option.id;

          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => onChange?.(option.id)}
              whileTap={{ scale: 0.97 }}
              className={`relative rounded-2xl border py-3 text-sm font-semibold transition-colors duration-200 focus:outline-none ${
                isSelected
                  ? 'border-transparent text-white'
                  : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-slate-400 hover:text-indigo-600'
              }`}
            >
              {isSelected && (
                <motion.span
                  layoutId="activePeriodBackground"
                  className="absolute inset-0 -z-10 rounded-2xl bg-indigo-600 shadow-md shadow-indigo-600/20"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <span className="relative z-10 block text-center">
                {option.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
