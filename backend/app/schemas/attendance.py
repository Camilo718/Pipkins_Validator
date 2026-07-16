from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class AttendanceBase(BaseModel):
    agent_id: str
    date: datetime
    scheduled_in: Optional[datetime] = None
    scheduled_out: Optional[datetime] = None
    actual_in: Optional[datetime] = None
    actual_out: Optional[datetime] = None
    scheduled_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    status: str = "ON_TIME"

class AttendanceCreate(AttendanceBase):
    discrepancies: Optional[Dict[str, Any]] = None

class AttendanceResponse(AttendanceBase):
    id: str
    discrepancies: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ComplianceReport(BaseModel):
    compliance_rate: float
    total_days: int
    on_time_days: int
    late_days: int
    early_departure_days: int
    total_late_minutes: int
    average_late_minutes: float