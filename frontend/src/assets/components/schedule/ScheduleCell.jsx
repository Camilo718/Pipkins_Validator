export default function ScheduleCell({ value }) {
  const free = value === 'Libre';

  return (
    <div
      className={`
                flex
                items-center
                justify-center
                rounded-xl
                px-3
                py-2
                text-sm
                font-medium

                ${
                  free
                    ? 'bg-slate-100 text-slate-400'
                    : 'bg-indigo-50 text-indigo-700'
                }
            `}
    >
      {value}
    </div>
  );
}
