from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.services.schedule_service import ScheduleService
from datetime import datetime
from typing import Optional, Dict, Any

router = APIRouter(prefix="/schedules", tags=["Schedules"])

@router.post("/")
def create_schedule(
    agent_id: str,
    week_start: str,
    week_end: str,
    monday: Optional[Dict[str, Any]] = None,
    tuesday: Optional[Dict[str, Any]] = None,
    wednesday: Optional[Dict[str, Any]] = None,
    thursday: Optional[Dict[str, Any]] = None,
    friday: Optional[Dict[str, Any]] = None,
    saturday: Optional[Dict[str, Any]] = None,
    sunday: Optional[Dict[str, Any]] = None,
    db: Session = Depends(get_db)
):
    """
    Crea o actualiza un horario semanal
    
    - **agent_id**: ID del agente
    - **week_start**: Fecha de inicio de la semana (YYYY-MM-DD)
    - **week_end**: Fecha de fin de la semana (YYYY-MM-DD)
    - **monday/tuesday/.../sunday**: Horario por día { "start": "08:00", "end": "17:00", "is_off": false }
    """
    try:
        service = ScheduleService(db)
        
        week_start_dt = datetime.fromisoformat(week_start)
        week_end_dt = datetime.fromisoformat(week_end)
        
        schedule = service.create_schedule(
            agent_id=agent_id,
            week_start=week_start_dt,
            week_end=week_end_dt,
            monday=monday,
            tuesday=tuesday,
            wednesday=wednesday,
            thursday=thursday,
            friday=friday,
            saturday=saturday,
            sunday=sunday
        )
        
        return {
            "message": "Horario creado/actualizado exitosamente",
            "schedule": {
                "id": schedule.id,
                "agent_id": schedule.agent_id,
                "week_start": schedule.week_start,
                "week_end": schedule.week_end,
                "monday": schedule.monday,
                "tuesday": schedule.tuesday,
                "wednesday": schedule.wednesday,
                "thursday": schedule.thursday,
                "friday": schedule.friday,
                "saturday": schedule.saturday,
                "sunday": schedule.sunday
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Formato de fecha inválido: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/agent/{agent_id}")
def get_agent_schedules(agent_id: str, db: Session = Depends(get_db)):
    """Obtiene todos los horarios de un agente"""
    try:
        service = ScheduleService(db)
        schedules = service.get_all_schedules_for_agent(agent_id)
        
        return {
            "agent_id": agent_id,
            "total": len(schedules),
            "data": [
                {
                    "id": s.id,
                    "week_start": s.week_start,
                    "week_end": s.week_end,
                    "monday": s.monday,
                    "tuesday": s.tuesday,
                    "wednesday": s.wednesday,
                    "thursday": s.thursday,
                    "friday": s.friday,
                    "saturday": s.saturday,
                    "sunday": s.sunday
                }
                for s in schedules
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))