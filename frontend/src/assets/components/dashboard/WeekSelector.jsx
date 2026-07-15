import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function WeekSelector() {
  return (
    <div className="flex items-center gap-6">
      <button
        className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-slate-100
                    transition
                    hover:bg-slate-200
                "
      >
        <ChevronLeft size={18} />
      </button>

      <div>
        <p className="text-xs uppercase tracking-wider text-slate-400">
          Semana
        </p>

        <h2 className="text-xl font-semibold">14 Jul - 20 Jul</h2>
      </div>

      <button
        className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-slate-100
                    transition
                    hover:bg-slate-200
                "
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
