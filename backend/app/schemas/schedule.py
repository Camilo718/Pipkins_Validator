from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class ScheduleDay(BaseModel):
    start: Optional[str] = None
    end: Optional[str] = None
    is_off: bool = False

class ScheduleCreate(BaseModel):
    agent_id: str
    week_start: datetime
    week_end: datetime
    monday: Optional[Dict[str, Any]] = None
    tuesday: Optional[Dict[str, Any]] = None
    wednesday: Optional[Dict[str, Any]] = None
    thursday: Optional[Dict[str, Any]] = None
    friday: Optional[Dict[str, Any]] = None
    saturday: Optional[Dict[str, Any]] = None
    sunday: Optional[Dict[str, Any]] = None

class ScheduleUpdate(BaseModel):
    monday: Optional[Dict[str, Any]] = None
    tuesday: Optional[Dict[str, Any]] = None
    wednesday: Optional[Dict[str, Any]] = None
    thursday: Optional[Dict[str, Any]] = None
    friday: Optional[Dict[str, Any]] = None
    saturday: Optional[Dict[str, Any]] = None
    sunday: Optional[Dict[str, Any]] = None

class ScheduleResponse(ScheduleCreate):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True