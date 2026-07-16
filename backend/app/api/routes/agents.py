from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.services.agent_service import AgentService
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse
from typing import List

router = APIRouter(prefix="/agents", tags=["Agents"])

@router.get("/", response_model=List[dict])
def get_all_agents(db: Session = Depends(get_db)):
    """Obtiene todos los agentes"""
    service = AgentService(db)
    agents = service.get_all_agents()
    
    return [
        {
            "id": agent.id,
            "employee_id": agent.employee_id,
            "full_name": agent.full_name,
            "position": agent.position,
            "created_at": agent.created_at,
            "updated_at": agent.updated_at
        }
        for agent in agents
    ]

@router.post("/", response_model=dict)
def create_agent(agent: AgentCreate, db: Session = Depends(get_db)):
    """Crea un nuevo agente"""
    service = AgentService(db)
    created_agent = service.get_or_create_agent(
        agent.employee_id, 
        agent.full_name, 
        agent.position
    )
    
    return {
        "id": created_agent.id,
        "employee_id": created_agent.employee_id,
        "full_name": created_agent.full_name,
        "position": created_agent.position,
        "created_at": created_agent.created_at,
        "updated_at": created_agent.updated_at
    }

@router.get("/{agent_id}", response_model=dict)
def get_agent(agent_id: str, db: Session = Depends(get_db)):
    """Obtiene un agente por ID"""
    service = AgentService(db)
    agent = service.get_agent_by_id(agent_id)
    
    if not agent:
        raise HTTPException(status_code=404, detail="Agente no encontrado")
    
    return {
        "id": agent.id,
        "employee_id": agent.employee_id,
        "full_name": agent.full_name,
        "position": agent.position,
        "created_at": agent.created_at,
        "updated_at": agent.updated_at
    }

@router.put("/{agent_id}", response_model=dict)
def update_agent(agent_id: str, agent_update: AgentUpdate, db: Session = Depends(get_db)):
    """Actualiza un agente"""
    service = AgentService(db)
    updated_agent = service.update_agent(
        agent_id,
        agent_update.full_name,
        agent_update.position
    )
    
    if not updated_agent:
        raise HTTPException(status_code=404, detail="Agente no encontrado")
    
    return {
        "id": updated_agent.id,
        "employee_id": updated_agent.employee_id,
        "full_name": updated_agent.full_name,
        "position": updated_agent.position,
        "created_at": updated_agent.created_at,
        "updated_at": updated_agent.updated_at
    }

@router.delete("/{agent_id}")
def delete_agent(agent_id: str, db: Session = Depends(get_db)):
    """Elimina un agente"""
    service = AgentService(db)
    success = service.delete_agent(agent_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Agente no encontrado")
    
    return {"message": "Agente eliminado exitosamente"}