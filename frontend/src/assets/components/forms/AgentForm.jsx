import { useState } from 'react';
import Input from '../iu/Input';
import Button from '../iu/Button';
import DayScheduleRow from './DayScheduleRow';

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const DEFAULT_SCHEDULE = {
  monday: { start: '08:00', end: '17:00', isOff: false },
  tuesday: { start: '08:00', end: '17:00', isOff: false },
  wednesday: { start: '08:00', end: '17:00', isOff: false },
  thursday: { start: '08:00', end: '17:00', isOff: false },
  friday: { start: '08:00', end: '17:00', isOff: false },
  saturday: { start: '08:00', end: '12:00', isOff: false },
  sunday: { start: '00:00', end: '00:00', isOff: true },
};

export default function AgentForm({
  initialData = null,
  onSubmit,
  onCancel
}) {
  const [step, setStep] = useState(1);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [scheduleToApply, setScheduleToApply] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);

  const [agent, setAgent] = useState({
    name: initialData?.name || "",
    document: initialData?.document || initialData?.employeeId || "",
    role: initialData?.role || "Agent",
  });

  const [schedule, setSchedule] = useState(initialData?.schedule || { ...DEFAULT_SCHEDULE });

  const handleInputChange = (field, value) => {
    setAgent((prev) => ({ ...prev, [field]: value }));
  };

  const handleScheduleChange = (dayKey, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [field]: value }
    }));
  };

  const handleApplyToDays = (sourceDayKey, daySchedule) => {
    setScheduleToApply({ ...daySchedule });
    setSelectedDays([]);
    setShowApplyModal(true);
  };

  const applySchedule = () => {
    if (selectedDays.length === 0) {
      alert('Select at least one day');
      return;
    }

    setSchedule((prev) => {
      const updated = { ...prev };
      selectedDays.forEach((dayKey) => {
        updated[dayKey] = { ...scheduleToApply, isOff: false };
      });
      return updated;
    });

    setShowApplyModal(false);
  };

  const handleNextStep = () => {
    if (!agent.name.trim()) {
      alert('Please complete the name.');
      return;
    }
    
    if (!initialData && !agent.document.trim()) {
      alert('Please complete the identity document.');
      return;
    }
    
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FORM DEBUG: handleSubmit triggered");
    console.log("FORM DEBUG: Final data:", { ...agent, schedule });
    onSubmit({ ...agent, schedule });
  };

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-center gap-2 pb-2">
        <span className={`h-2.5 w-2.5 rounded-full ${step === 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
        <span className="h-1 w-12 rounded bg-slate-100" />
        <span className={`h-2.5 w-2.5 rounded-full ${step === 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
      </div>

      {step === 1 && (
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">
              {isEditing ? 'Edit Agent' : 'Agent Information'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isEditing ? 'You can update the name and position.' : 'Register the new agent identity details.'}
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g., John Doe"
              value={agent.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            
            <Input
              label="Identity Document"
              placeholder="e.g., 12345678"
              value={agent.document}
              onChange={(e) => handleInputChange('document', e.target.value)}
              required={!isEditing}
              disabled={isEditing}
              readOnly={isEditing}
            />
            
            <Input
              label="Role / Position"
              placeholder="e.g., Technical Advisor"
              value={agent.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={handleNextStep}>
              Next: Schedule
            </Button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">Base Schedule (Default)</h2>
            <p className="text-sm text-slate-500 mt-1">
              This schedule will be applied as standard.<br />
              Agent: <strong className="text-indigo-600">{agent.name}</strong>
            </p>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {DAYS_OF_WEEK.map((day) => (
              <DayScheduleRow
                key={day.key}
                dayKey={day.key}
                label={day.label}
                schedule={schedule[day.key]}
                onChange={handleScheduleChange}
                onApplyToDays={handleApplyToDays}
              />
            ))}
          </div>

          <div className="flex justify-between gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>
              ← Back
            </Button>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {isEditing ? 'Save Changes' : 'Create Agent and Schedule'}
              </Button>
            </div>
          </div>
        </section>
      )}

      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Apply Schedule to Other Days</h3>
            <p className="text-sm text-slate-500">
              Will be applied: <strong>{scheduleToApply?.start} - {scheduleToApply?.end}</strong>
            </p>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Select the days:</p>
              {DAYS_OF_WEEK.map((day) => (
                <label key={day.key} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day.key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDays([...selectedDays, day.key]);
                      } else {
                        setSelectedDays(selectedDays.filter(d => d !== day.key));
                      }
                    }}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                  />
                  <span>{day.label}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setShowApplyModal(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={applySchedule} className="bg-indigo-600 text-white">
                Apply ({selectedDays.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}