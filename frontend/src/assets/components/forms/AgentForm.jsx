import { useState, useEffect } from "react";

import PeriodSelector from "../schedule/PeriodSelector";
import CalendarRangePicker from "../schedule/CalendarRangePicker";
import ScheduleEditorTable from "../schedule/ScheduleEditorTable";
import QuickSchedule from "../schedule/QuickSchedule";

import Input from "../iu/Input";
import Button from "../iu/Button";

export default function AgentForm({
  initialData = null,
  onSubmit,
  onCancel,
}) {
  const [period, setPeriod] = useState(initialData?.period || "week");
  const [range, setRange] = useState(initialData?.range || undefined);
  
  // Ahora manejamos schedule como un objeto indexado por fecha: { "YYYY-MM-DD": { working, start, end } }
  const [schedule, setSchedule] = useState(initialData?.schedule || {});

  const [agent, setAgent] = useState({
    name: initialData?.name || "",
    document: initialData?.document || "",
    role: initialData?.role || "",
    campaign: initialData?.campaign || "",
  });

  // Manejador centralizado para los campos del perfil del agente
  const handleInputChange = (field, value) => {
    setAgent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Actualiza o agrega un día específico usando su clave de fecha ("yyyy-MM-dd")
  const updateSchedule = (dateKey, dayData) => {
    setSchedule((prev) => ({
      ...prev,
      [dateKey]: dayData,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones básicas de negocio antes de enviar
    if (!agent.name.trim() || !agent.document.trim()) {
      alert("Por favor, completa al menos el nombre y documento del agente.");
      return;
    }

    onSubmit({
      ...agent,
      period,
      range,
      schedule, // Se envía el diccionario estructurado de horarios
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* SECCIÓN: INFORMACIÓN DEL AGENTE */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Información del Agente
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Nombre completo"
            placeholder="Ej. Juan Pérez"
            value={agent.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />

          <Input
            label="Documento de Identidad"
            placeholder="Ej. 10203040"
            value={agent.document}
            onChange={(e) => handleInputChange("document", e.target.value)}
            required
          />

          <Input
            label="Rol / Cargo"
            placeholder="Ej. Asesor Técnico"
            value={agent.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
          />

          <Input
            label="Campaña"
            placeholder="Ej. Soporte SN-52"
            value={agent.campaign}
            onChange={(e) => handleInputChange("campaign", e.target.value)}
          />
        </div>
      </section>

      {/* SECCIÓN: PERÍODO */}
      <PeriodSelector
        value={period}
        onChange={setPeriod}
      />

      {/* SECCIÓN: RANGO DE FECHAS */}
      <CalendarRangePicker
        value={range}
        onChange={setRange}
      />

      {/* SECCIÓN: ACCIONES DE LLENADO RÁPIDO */}
      {/* 
        Nota: Asegúrate de que tu componente QuickSchedule esté listo para escribir 
        directamente llaves de fecha en el objeto de 'schedule'. 
      */}
      <QuickSchedule
        schedule={schedule}
        setSchedule={setSchedule}
      />

      {/* SECCIÓN: TABLA DETALLADA DE HORARIO */}
      <ScheduleEditorTable
        range={range}
        schedule={schedule}
        onChange={updateSchedule}
      />

      {/* SECCIÓN: BOTONES DE ACCIÓN */}
      <div className="flex justify-end gap-4 border-t border-slate-100 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancelar
        </Button>

        <Button type="submit">
          {initialData ? "Guardar Cambios" : "Crear Agente"}
        </Button>
      </div>
    </form>
  );
}