export default function ScheduleCell({ value }) {
  // Si el valor es un objeto (como { start: '08:00', end: '17:00', isOff: false })
  if (typeof value === 'object' && value !== null) {
    const isOff = value.isOff;
    const displayText = isOff ? 'Libre' : `${value.start} - ${value.end}`;
    
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
          ${isOff ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-700'}
        `}
      >
        {displayText}
      </div>
    );
  }

  // Fallback por si llega como string 'Libre' o está vacío
  const isFree = value === 'Libre' || !value;
  const displayText = isFree ? 'Libre' : value;

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
        ${isFree ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-700'}
      `}
    >
      {displayText}
    </div>
  );
}