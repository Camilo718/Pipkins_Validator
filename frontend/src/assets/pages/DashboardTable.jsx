import { useState } from 'react';
import Hero from '../components/dashboard/Hero';
import StatsGrid from '../components/dashboard/StatsGrid';
import Toolbar from '../components/dashboard/Toolbar';
import ScheduleTable from '../components/schedule/ScheduleTable';
import Modal from '../components/iu/Modal';
import AgentForm from '../components/forms/AgentForm';
import useAgents from "../hooks/useAgents";
import apiService from '../services/api';

export default function Dashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const { agents, loading, refetch } = useAgents();

  const handleOpenForm = (agent = null) => {
    setEditingAgent(agent);
    setOpenModal(true);
  };

  const handleCloseForm = () => {
    setOpenModal(false);
    window.setTimeout(() => setEditingAgent(null), 200);
  };

  const handleSubmitAgent = async (agentData) => {


    try {
      if (editingAgent && editingAgent.id) {
        
        const agentPayload = {
          full_name: agentData.name,
          position: agentData.role || 'Agent',
        };
        await apiService.updateAgent(editingAgent.id, agentPayload);


        if (agentData.schedule) {
          await apiService.updateSchedule(editingAgent.id, agentData.schedule);
        }
        
        alert('Agent and schedule updated successfully');
      } else {
        const newAgent = await apiService.createAgent({
          employee_id: agentData.document || `EMP-${Date.now()}`,
          full_name: agentData.name,
          position: agentData.role || 'Agent',
        });

        if (agentData.schedule) {
          await apiService.createDefaultSchedule(newAgent.id, agentData.schedule);
        }
        alert('Agent created successfully');
      }

      refetch();
      handleCloseForm();
      
    } catch (err) {
      alert('Error saving: ' + err.message);
    }
  };

  const handleDeleteAgent = async (agentId) => {
    try {
      await apiService.deleteAgent(agentId);
      alert('Agent deleted successfully');
      refetch();
    } catch (err) {
      console.error("Error deleting:", err);
      alert('Error deleting: ' + err.message);
    }
  };

  const handleImportExcel = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const startDate = prompt('Start date (YYYY-MM-DD):', '2026-07-01');
      const endDate = prompt('End date (YYYY-MM-DD):', '2026-07-31');

      if (!startDate || !endDate) {
        alert('You must enter the dates to process the Excel file.');
        return;
      }

      try {
        alert('Uploading and processing file...');
        const result = await apiService.uploadExcel(file, startDate, endDate);
        alert(`Excel processed successfully!\n\nRecords saved: ${result.total_records}\nDiscrepancies found: ${result.discrepancies}`);
        refetch();
      } catch (err) {
        console.error("Error uploading Excel:", err);
        alert('Error uploading Excel: ' + err.message);
      }
    };

    input.click();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading agents...</div>;
  }

  return (
    <div className="space-y-8 p-6">
      <Hero />
      <StatsGrid />
      
      <Toolbar
        onAddAgent={() => {
          setEditingAgent(null);
          setOpenModal(true);
        }}
        onImportExcel={handleImportExcel}
      />
      
      <ScheduleTable 
        agents={agents} 
        onEdit={handleOpenForm} 
        onDelete={handleDeleteAgent} 
      />
      
      <Modal
        open={openModal}
        title={editingAgent ? 'Edit Agent' : 'Add New Agent'}
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