import { useState } from 'react';
import ExcelUpload from '../components/comparison/ExcelUpload';
import ComparisonTable from '../components/comparison/ComparisonTable';
import AgentSelector from '../components/comparison/AgentSelector';
import DateRangePicker from '../components/comparison/DateRangePicker';
import Button from '../components/iu/Button';
import { Download, RefreshCw } from 'lucide-react';
import apiService from '../services/api';

export default function ComparisonPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [excelFile, setExcelFile] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (file) => {
    setExcelFile(file);
  };

  const handleCompare = async () => {
    if (!startDate || !endDate) {
      alert('Please select a date range');
      return;
    }

    if (!excelFile) {
      alert('Please upload the Pipkins Excel file');
      return;
    }

    setLoading(true);
    try {
      console.log('📤 Uploading Excel file...');
      await apiService.uploadExcel(excelFile, startDate, endDate);
      console.log('✅ Upload successful');
      
      console.log('📥 Fetching comparison data...');
      let flattenedData = [];
      
      if (selectedAgent === 'all') {
        const response = await apiService.getAllAgentsCompliance(startDate, endDate);
        console.log('All agents response:', response);
        
        if (response.data) {
          flattenedData = response.data.flatMap(item => 
            (item.compliance?.attendances || []).map(att => ({
              agent: item.agent,
              ...att
            }))
          );
        }
      } else {
        const response = await apiService.getAgentCompliance(selectedAgent, startDate, endDate);
        console.log('Single agent response:', response);
        
        const agentsResponse = await apiService.getAgents();
        const agentDetails = agentsResponse.find(a => a.id === selectedAgent);
        
        // ✅ CORREGIDO: Usar response.compliance.attendances
        if (response.compliance?.attendances) {
          flattenedData = response.compliance.attendances.map(att => ({
            agent: agentDetails || { id: selectedAgent, full_name: 'Unknown', employee_id: '' },
            ...att
          }));
        }
      }
      
      console.log('📋 Flattened comparison data:', flattenedData);
      setComparisonData(flattenedData);
      
      if (flattenedData.length === 0) {
        alert('No comparison data found. Make sure the schedule covers the selected dates.');
      } else {
        alert(`Comparison completed! Found ${flattenedData.length} records.`);
      }
      
    } catch (error) {
      console.error('❌ Error comparing:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    alert('Export functionality will be implemented soon');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Attendance Comparison</h1>
          <p className="text-sm text-slate-500 mt-1">
            Compare scheduled hours vs actual attendance from Pipkins Excel
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          
          <AgentSelector
            value={selectedAgent}
            onChange={setSelectedAgent}
          />
          
          <div className="flex items-end">
            <Button 
              onClick={handleCompare} 
              disabled={loading || !excelFile}
              icon={<RefreshCw size={18} />}
              className="w-full"
            >
              {loading ? 'Processing...' : 'Compare Data'}
            </Button>
          </div>
        </div>

        <ExcelUpload onFileUpload={handleFileUpload} />
      </div>

      {comparisonData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Comparison Results</h2>
            <Button 
              variant="secondary" 
              icon={<Download size={18} />}
              onClick={handleExport}
            >
              Export to Excel
            </Button>
          </div>
          
          <ComparisonTable data={comparisonData} />
        </div>
      )}
    </div>
  );
}