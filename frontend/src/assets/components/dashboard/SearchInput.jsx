import { Search } from 'lucide-react';

export default function SearchInput() {
  return (
    <div className="relative w-[320px]">
      <Search
        className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                "
        size={18}
      />
      <input
        placeholder="Buscar agente..."
        className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    pl-11
                    pr-4
                    text-sm
                    outline-none
                    transition
                    focus:border-indigo-500
                    focus:bg-white
                "
      />
    </div>
  );
}
