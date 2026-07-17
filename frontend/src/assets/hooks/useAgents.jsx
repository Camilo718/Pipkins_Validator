import { useState, useEffect } from 'react';
import apiService from '../services/api';

const DEFAULT_SCHEDULE = {
  monday: { start: '08:00', end: '17:00', isOff: false },
  tuesday: { start: '08:00', end: '17:00', isOff: false },
  wednesday: { start: '08:00', end: '17:00', isOff: false },
  thursday: { start: '08:00', end: '17:00', isOff: false },
  friday: { start: '08:00', end: '17:00', isOff: false },
  saturday: { start: '08:00', end: '12:00', isOff: false },
  sunday: { start: '00:00', end: '00:00', isOff: true },
};

export default function useAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAgents();
      
      const transformedAgents = data.map((agent) => ({
        id: agent.id,
        name: agent.full_name,
        role: agent.position || 'Agente',
        employeeId: agent.employee_id,
        document: agent.employee_id,  
        avatar: agent.full_name
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        schedule: agent.schedule || { ...DEFAULT_SCHEDULE }
      }));
      
      setAgents(transformedAgents);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return { agents, loading, error, refetch: fetchAgents };
}