import { useState } from 'react';
import Hero from '../components/dashboard/Hero';
import StatsGrid from '../components/dashboard/StatsGrid';
import Toolbar from '../components/dashboard/Toolbar';
import ScheduleTable from '../components/schedule/ScheduleTable';
import Modal from '../components/iu/Modal';
import AgentForm from '../components/forms/AgentForm';
import { initialAgents } from '../data/agents';

export default function Dashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [agents, setAgents] = useState(initialAgents);

  const handleOpenForm = (agent = null) => {
    setEditingAgent(agent);
    setOpenModal(true);
  };

  const handleCloseForm = () => {
    setOpenModal(false);
    window.setTimeout(() => setEditingAgent(null), 200);
  };

  const handleSubmitAgent = (agentData) => {
    if (editingAgent) {
      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === editingAgent.id
            ? { ...agent, ...agentData, id: agent.id }
            : agent
        )
      );
    } else {
      const days = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ];
      const summary = Object.entries(agentData.schedule || {}).reduce(
        (acc, [dateKey, value]) => {
          if (!value?.working) {
            return acc;
          }

          const dayName = days[(new Date(dateKey).getDay() + 6) % 7];
          acc[dayName] = `${value.start || '08:00'} - ${value.end || '17:00'}`;
          return acc;
        },
        {}
      );

      const newAgent = {
        id: Date.now(),
        name: agentData.name,
        role: agentData.role || 'Agente',
        avatar: agentData.name
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        schedule: {
          monday: summary.monday || 'Libre',
          tuesday: summary.tuesday || 'Libre',
          wednesday: summary.wednesday || 'Libre',
          thursday: summary.thursday || 'Libre',
          friday: summary.friday || 'Libre',
          saturday: summary.saturday || 'Libre',
          sunday: summary.sunday || 'Libre',
        },
        match: 'success',
      };

      setAgents((prev) => [newAgent, ...prev]);
    }

    handleCloseForm();
  };

  return (
    <div className="space-y-8">
      <Hero />
      <StatsGrid />
      <Toolbar
        onAddAgent={() => {
          setEditingAgent(null);
          setOpenModal(true);
        }}
        onImportExcel={() => {
          console.log('Importando Excel');
        }}
      />
      <ScheduleTable agents={agents} onEdit={handleOpenForm} />
      <Modal
        open={openModal}
        title={editingAgent ? 'Editar Agente' : 'Agregar Agente'}
        onClose={handleCloseForm}
      >
        <AgentForm
          key={editingAgent?.id ?? 'new'}
          initialData={editingAgent}
          onCancel={handleCloseForm}
          onSubmit={handleSubmitAgent}
        />
      </Modal>
    </div>
  );
}
