const API_BASE_URL = 'https://pillow-occurrence-lopez-midi.trycloudflare.com/api/v1';

class ApiService {
  async getAgents() {
    const response = await fetch(`${API_BASE_URL}/agents/`);
    if (!response.ok) throw new Error('Error fetching agents');
    return response.json();
  }

  async createAgent(agentData) {
    const response = await fetch(`${API_BASE_URL}/agents/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agentData),
    });
    if (!response.ok) throw new Error('Error creating agent');
    return response.json();
  }

  async updateAgent(agentId, agentData) {
    const response = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agentData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error updating agent');
    }
    return response.json();
  }

  async updateSchedule(agentId, scheduleData) {
    const response = await fetch(`${API_BASE_URL}/schedules/${agentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scheduleData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error updating schedule');
    }
    return response.json();
  }

  async deleteAgent(agentId) {
    const response = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Error deleting agent');
    }
    return response.json();
  }

  async createDefaultSchedule(agentId, scheduleData) {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(today.setDate(diff)).toISOString();
    
    const weekEnd = new Date();
    weekEnd.setFullYear(weekEnd.getFullYear() + 10);
    
    const payload = {
      agent_id: agentId,
      week_start: weekStart,
      week_end: weekEnd.toISOString(),
      monday: scheduleData.monday,
      tuesday: scheduleData.tuesday,
      wednesday: scheduleData.wednesday,
      thursday: scheduleData.thursday,
      friday: scheduleData.friday,
      saturday: scheduleData.saturday,
      sunday: scheduleData.sunday
    };

    const response = await fetch(`${API_BASE_URL}/schedules/create-default`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error creating default schedule');
    }
    
    return response.json();
  }

  async uploadExcel(file, startDate, endDate) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);

    const response = await fetch(`${API_BASE_URL}/attendance/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error uploading Excel');
    }
    return response.json();
  }

  async getSummaryReport(startDate, endDate) {
    const response = await fetch(
      `${API_BASE_URL}/reports/summary?start_date=${startDate}&end_date=${endDate}`
    );
    if (!response.ok) throw new Error('Error fetching summary');
    return response.json();
  }


  async getAgentCompliance(agentId, startDate, endDate) {
    const response = await fetch(
      `${API_BASE_URL}/attendance/agent/${agentId}/compliance?start_date=${startDate}&end_date=${endDate}`
    );
    if (!response.ok) throw new Error('Error fetching agent compliance');
    return response.json();
  }

  async getAllAgentsCompliance(startDate, endDate) {
    const response = await fetch(
      `${API_BASE_URL}/attendance/all-agents/compliance?start_date=${startDate}&end_date=${endDate}`
    );
    if (!response.ok) throw new Error('Error fetching all agents compliance');
    return response.json();
  }

  async getAttendances(agentId = null, startDate = null, endDate = null) {
    let url = `${API_BASE_URL}/attendance/`;
    const params = new URLSearchParams();
    
    if (agentId) params.append('agent_id', agentId);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error fetching attendances');
    return response.json();
  }

  async getDiscrepancies(agentId = null, startDate = null, endDate = null, discrepancyType = null) {
    let url = `${API_BASE_URL}/reports/discrepancies`;
    const params = new URLSearchParams();
    
    if (agentId) params.append('agent_id', agentId);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (discrepancyType) params.append('discrepancy_type', discrepancyType);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error fetching discrepancies');
    return response.json();
  }
}

export const apiService = new ApiService();
export default apiService;