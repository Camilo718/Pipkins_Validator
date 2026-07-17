export default function ComparisonTable({ data }) {
  const formatTime = (dateStr) => {
    if (!dateStr) return '--:--';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '--:--';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      'ON_TIME': { bg: 'bg-green-100', text: 'text-green-700', label: 'On Time' },
      'LATE_ARRIVAL': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Late' },
      'EARLY_DEPARTURE': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Early Departure' },
      'ABSENT': { bg: 'bg-red-100', text: 'text-red-700', label: 'Absent' },
      'OVERTIME': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Overtime' },
      'DAY_OFF': { bg: 'bg-slate-100', text: 'text-slate-500', label: 'Day Off' }
    };

    const badge = badges[status] || badges['ON_TIME'];

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  // ✅ Detectar si es día libre
  const isDayOff = (row) => {
    const scheduledIn = row.scheduled_in ? new Date(row.scheduled_in) : null;
    const scheduledOut = row.scheduled_out ? new Date(row.scheduled_out) : null;
    
    // Si ambas horas son 00:00 (medianoche), es día libre
    if (scheduledIn && scheduledOut && 
        scheduledIn.getHours() === 0 && scheduledIn.getMinutes() === 0 &&
        scheduledOut.getHours() === 0 && scheduledOut.getMinutes() === 0) {
      return true;
    }
    
    // Si el status es ON_TIME y scheduled_hours es 0
    if (row.status === 'ON_TIME' && (!row.scheduled_hours || row.scheduled_hours === 0)) {
      return true;
    }
    
    return false;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Agent</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Scheduled</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actual In</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actual Out</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Discrepancy</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((row, index) => {
            const dayOff = isDayOff(row);
            
            return (
              <tr key={index} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{row.agent?.full_name || 'N/A'}</div>
                  <div className="text-xs text-slate-500">{row.agent?.employee_id || ''}</div>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {formatDate(row.date)}
                </td>
                
                {/* ✅ Scheduled: mostrar "Libre" si es día libre */}
                <td className="px-4 py-3 text-slate-700">
                  {dayOff ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-400">
                      Libre
                    </span>
                  ) : (
                    `${formatTime(row.scheduled_in)} - ${formatTime(row.scheduled_out)}`
                  )}
                </td>
                
                {/* ✅ Actual In/Out: mostrar "--" si es día libre */}
                <td className="px-4 py-3 text-slate-700">
                  {dayOff || !row.actual_in ? '--:--' : formatTime(row.actual_in)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {dayOff || !row.actual_out ? '--:--' : formatTime(row.actual_out)}
                </td>
                
                {/* ✅ Status */}
                <td className="px-4 py-3">
                  {dayOff ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                      Day Off
                    </span>
                  ) : (
                    getStatusBadge(row.status)
                  )}
                </td>
                
                {/* ✅ Discrepancy */}
                <td className="px-4 py-3">
                  {dayOff ? (
                    <span className="text-sm text-slate-400">--</span>
                  ) : row.discrepancies?.minutes ? (
                    <span className="text-sm font-medium text-orange-600">
                      {row.discrepancies.minutes} min
                    </span>
                  ) : (
                    <span className="text-sm text-green-600">None</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}