import React from 'react';

export default function DayScheduleRow({ 
  dayKey, 
  label, 
  schedule, 
  onChange,
  onApplyToDays 
}) {
  const daySchedule = schedule || { start: '00:00', end: '00:00', isOff: true };
  const isOff = daySchedule.isOff;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-slate-100 hover:border-indigo-200 transition">
      <div className="flex items-center gap-3 sm:w-1/3">
        <input
          type="checkbox"
          id={`off-${dayKey}`}
          checked={isOff}
          onChange={(e) => onChange && onChange(dayKey, 'isOff', e.target.checked)}
          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
        />
        <label 
          htmlFor={`off-${dayKey}`} 
          className={`font-medium cursor-pointer select-none ${isOff ? 'text-slate-400 line-through' : 'text-slate-700'}`}
        >
          {label}
        </label>
      </div>

      <div className="flex items-center gap-2 sm:w-2/3">
        <input
          type="time"
          value={isOff ? '' : daySchedule.start}
          disabled={isOff}
          onChange={(e) => onChange && onChange(dayKey, 'start', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition ${
            isOff 
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
              : 'bg-white border-slate-300 text-slate-800'
          }`}
        />
        <span className="text-slate-400 font-medium">to</span>
        <input
          type="time"
          value={isOff ? '' : daySchedule.end}
          disabled={isOff}
          onChange={(e) => onChange && onChange(dayKey, 'end', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition ${
            isOff 
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
              : 'bg-white border-slate-300 text-slate-800'
          }`}
        />
        
        {!isOff && onApplyToDays && (
          <button
            type="button"
            onClick={() => onApplyToDays(dayKey, daySchedule)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            title="Apply this schedule to other days"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}