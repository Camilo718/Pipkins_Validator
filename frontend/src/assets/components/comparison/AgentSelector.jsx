import { useEffect, useState } from 'react';
import apiService from '../../services/api';

export default function AgentSelector({ value, onChange }) {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await apiService.getAgents();
        setAgents(data);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };
    fetchAgents();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Agent
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
      >
        <option value="all">All Agents</option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.full_name}
          </option>
        ))}
      </select>
    </div>
  );
}