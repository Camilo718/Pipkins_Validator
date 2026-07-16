import { useState } from 'react';
import CalendarRangePicker from '../schedule/CalendarRangePicker';
import ScheduleEditorTable from '../schedule/ScheduleEditorTable';
import QuickSchedule from '../schedule/QuickSchedule';
import Input from '../iu/Input';
import Button from '../iu/Button';

export default function AgentForm({
  initialData = null,
  onSubmit,
  onCancel
}) {
  // Control del paso actual: 1 (Datos) o 2 (Horarios)
  const [step, setStep] = useState(1);

  const [period, setPeriod] = useState(initialData?.period || 'week');
  const [range, setRange] = useState(initialData?.range || undefined);
  const [schedule, setSchedule] = useState(initialData?.schedule || {});

  const [agent, setAgent] = useState({
    name: initialData?.name || "",
    document: initialData?.document || "",
    role: initialData?.role || "",
  });

  const handleInputChange = (field, value) => {
    setAgent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSchedule = (dateKey, dayData) => {
    setSchedule((prev) => ({
      ...prev,
      [dateKey]: dayData,
    }));
  };

  // Validar y avanzar al paso 2
  const handleNextStep = () => {
    if (!agent.name.trim() || !agent.document.trim()) {
      alert('Por favor, completa el nombre y el documento de identidad.');
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación final en el paso 2
    if (!range?.from || !range?.to) {
      alert('Por favor, selecciona un rango de fechas para el horario.');
      return;
    }

    onSubmit({
      ...agent,
      period,
      range,
      schedule,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* INDICADOR DE PASOS VISUAL (Progreso) */}
      <div className="flex items-center justify-center gap-2 pb-2">
        <span className={`h-2.5 w-2.5 rounded-full ${step === 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
        <span className="h-1 w-12 rounded bg-slate-100" />
        <span className={`h-2.5 w-2.5 rounded-full ${step === 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
      </div>

      {/* ================= PASO 1: DATOS PERSONALES ================= */}
      {step === 1 && (
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">Información del Agente</h2>
            <p className="text-sm text-slate-500 mt-1">Registra los datos de identidad del nuevo agente laboral.</p>
          </div>

          <div className="space-y-4">
            <Input
              label="Nombre completo"
              placeholder="Ej. Juan Pérez"
              value={agent.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />

            <Input
              label="Documento de Identidad"
              placeholder="Ej. 10203040"
              value={agent.document}
              onChange={(e) => handleInputChange('document', e.target.value)}
              required
            />

            <Input
              label="Rol / Cargo"
              placeholder="Ej. Asesor Técnico"
              value={agent.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleNextStep}>
              Siguiente
            </Button>
          </div>
        </section>
      )}

      {/* ================= PASO 2: ASIGNACIÓN DE HORARIOS ================= */}
      {step === 2 && (
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">Planificación del Horario</h2>
            <p className="text-sm text-slate-500 mt-1">
              Agente: <strong className='text-slate-700 font-semibold'>{agent.name}</strong>
            </p>
          </div>

          <div className="grid gap-6">
            {/* Fechas */}
            <div className="grid gap-2 md:grid-cols-1">
              <CalendarRangePicker value={range} onChange={setRange} />
            </div>

            {/* Configuración Rápida */}
            <QuickSchedule schedule={schedule} setSchedule={setSchedule} />

            {/* Tabla Detallada */}
            <ScheduleEditorTable
              range={range}
              schedule={schedule}
              onChange={updateSchedule}
            />
          </div>

          <div className="flex justify-between gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>
              Atrás
            </Button>

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                {initialData ? 'Guardar Cambios' : 'Crear Agente'}
              </Button>
            </div>
          </div>
        </section>
      )}
    </form>
  );
}
