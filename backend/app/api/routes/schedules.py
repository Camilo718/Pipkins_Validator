from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.services.schedule_service import ScheduleService
from app.models.schedule import Schedule
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

router = APIRouter(prefix="/schedules", tags=["Schedules"])

@router.post("/")
def create_schedule(
    agent_id: str = Body(...),
    week_start: str = Body(...),
    week_end: str = Body(...),
    monday: Optional[Dict[str, Any]] = Body(None),
    tuesday: Optional[Dict[str, Any]] = Body(None),
    wednesday: Optional[Dict[str, Any]] = Body(None),
    thursday: Optional[Dict[str, Any]] = Body(None),
    friday: Optional[Dict[str, Any]] = Body(None),
    saturday: Optional[Dict[str, Any]] = Body(None),
    sunday: Optional[Dict[str, Any]] = Body(None),
    db: Session = Depends(get_db)
):
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
            "message": "Schedule created/updated successfully",
            "schedule": {
                "id": schedule.id,
                "agent_id": schedule.agent_id,
                "week_start": schedule.week_start.isoformat(),
                "week_end": schedule.week_end.isoformat(),
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
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/create-default")
def create_default_schedule(
    agent_id: str = Body(...),
    week_start: str = Body(...),
    week_end: str = Body(...),
    monday: Optional[Dict[str, Any]] = Body(None),
    tuesday: Optional[Dict[str, Any]] = Body(None),
    wednesday: Optional[Dict[str, Any]] = Body(None),
    thursday: Optional[Dict[str, Any]] = Body(None),
    friday: Optional[Dict[str, Any]] = Body(None),
    saturday: Optional[Dict[str, Any]] = Body(None),
    sunday: Optional[Dict[str, Any]] = Body(None),
    db: Session = Depends(get_db)
):
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
            "message": "Default schedule created successfully",
            "schedule": {
                "id": schedule.id,
                "agent_id": schedule.agent_id,
                "valid_from": week_start_dt.isoformat(),
                "valid_until": week_end_dt.isoformat(),
                "monday": schedule.monday,
                "tuesday": schedule.tuesday,
                "wednesday": schedule.wednesday,
                "thursday": schedule.thursday,
                "friday": schedule.friday,
                "saturday": schedule.saturday,
                "sunday": schedule.sunday
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/agent/{agent_id}")
def get_agent_schedules(agent_id: str, db: Session = Depends(get_db)):
    try:
        service = ScheduleService(db)
        schedules = service.get_all_schedules_for_agent(agent_id)
        
        return {
            "agent_id": agent_id,
            "total": len(schedules),
            "data": [
                {
                    "id": s.id,
                    "week_start": s.week_start.isoformat() if s.week_start else None,
                    "week_end": s.week_end.isoformat() if s.week_end else None,
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


# ✅ NUEVO ENDPOINT: Actualizar horario existente
@router.put("/{agent_id}")
def update_agent_schedule(
    agent_id: str,
    schedule_data: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    try:
        # Buscar el horario más reciente del agente
        existing_schedule = db.query(Schedule).filter(
            Schedule.agent_id == agent_id
        ).order_by(Schedule.week_start.desc()).first()
        
        if not existing_schedule:
            raise HTTPException(status_code=404, detail="Schedule not found for this agent")
        
        # Actualizar los días que vengan en el payload
        days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        for day in days:
            if day in schedule_data:
                setattr(existing_schedule, day, schedule_data[day])
        
        db.commit()
        db.refresh(existing_schedule)
        
        return {"message": "Schedule updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))