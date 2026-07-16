from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AgentBase(BaseModel):
    employee_id: str
    full_name: str
    position: Optional[str] = None

class AgentCreate(AgentBase):
    pass

class AgentUpdate(BaseModel):
    full_name: Optional[str] = None
    position: Optional[str] = None

class AgentResponse(AgentBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True