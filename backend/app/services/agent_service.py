from sqlalchemy.orm import Session
from app.models.agent import Agent
from app.schemas.agent import AgentCreate
from typing import List, Optional
import uuid

class AgentService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_or_create_agent(self, employee_id: str, full_name: str, position: str = None) -> Agent:
        """Busca o crea un agente"""
        agent = self.db.query(Agent).filter(Agent.employee_id == employee_id).first()
        
        if not agent:
            agent = Agent(
                id=str(uuid.uuid4()),
                employee_id=employee_id,
                full_name=full_name,
                position=position
            )
            self.db.add(agent)
            self.db.commit()
            self.db.refresh(agent)
        
        return agent
    
    def get_all_agents(self) -> List[Agent]:
        """Obtiene todos los agentes"""
        return self.db.query(Agent).all()
    
    def get_agent_by_id(self, agent_id: str) -> Optional[Agent]:
        """Obtiene un agente por ID"""
        return self.db.query(Agent).filter(Agent.id == agent_id).first()
    
    def get_agent_by_employee_id(self, employee_id: str) -> Optional[Agent]:
        """Obtiene un agente por employee_id"""
        return self.db.query(Agent).filter(Agent.employee_id == employee_id).first()
    
    def update_agent(self, agent_id: str, full_name: str = None, position: str = None) -> Optional[Agent]:
        """Actualiza un agente"""
        agent = self.get_agent_by_id(agent_id)
        if not agent:
            return None
        
        if full_name:
            agent.full_name = full_name
        if position:
            agent.position = position
        
        self.db.commit()
        self.db.refresh(agent)
        return agent
    
    def delete_agent(self, agent_id: str) -> bool:
        """Elimina un agente"""
        agent = self.get_agent_by_id(agent_id)
        if not agent:
            return False
        
        self.db.delete(agent)
        self.db.commit()
        return True