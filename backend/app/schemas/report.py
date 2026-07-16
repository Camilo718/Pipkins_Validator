from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DiscrepancyReport(BaseModel):
    id: str
    agent_id: str
    date: datetime
    type: str
    minutes: int
    description: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class WeeklyReport(BaseModel):
    agent_id: str
    agent_name: str
    week_start: datetime
    week_end: datetime
    total_scheduled_hours: float
    total_actual_hours: float
    total_discrepancies: int
    compliance_rate: float
    
class AgentComplianceSummary(BaseModel):
    agent_id: str
    full_name: str
    employee_id: str
    compliance_rate: float
    total_days: int
    on_time_days: int
    late_days: int
    total_late_minutes: int