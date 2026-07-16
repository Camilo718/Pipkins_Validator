from sqlalchemy.orm import Session
from app.models.schedule import Schedule
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
import uuid

class ScheduleService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_schedule_for_date(self, agent_id: str, date: datetime) -> Optional[Dict[str, Any]]:
        """Obtiene el horario de un agente para una fecha específica"""
        # Buscar la semana que contiene esa fecha
        week_start = date.replace(hour=0, minute=0, second=0, microsecond=0)
        # Ajustar al lunes de esa semana (weekday() retorna 0 para lunes)
        week_start = week_start - timedelta(days=week_start.weekday())
        week_end = week_start + timedelta(days=6, hours=23, minutes=59, seconds=59)
        
        schedule = self.db.query(Schedule).filter(
            Schedule.agent_id == agent_id,
            Schedule.week_start <= week_start,
            Schedule.week_end >= week_end
        ).first()
        
        if not schedule:
            return None
        
        # Mapear día de la semana al campo correspondiente
        # weekday() retorna 0 (lunes) a 6 (domingo)
        day_map = {
            0: schedule.monday,
            1: schedule.tuesday,
            2: schedule.wednesday,
            3: schedule.thursday,
            4: schedule.friday,
            5: schedule.saturday,
            6: schedule.sunday
        }
        
        return day_map.get(date.weekday())
    
    def create_schedule(self, agent_id: str, week_start: datetime, week_end: datetime,
                       monday: Dict[str, Any] = None, tuesday: Dict[str, Any] = None,
                       wednesday: Dict[str, Any] = None, thursday: Dict[str, Any] = None,
                       friday: Dict[str, Any] = None, saturday: Dict[str, Any] = None,
                       sunday: Dict[str, Any] = None) -> Schedule:
        """Crea un horario semanal"""
        # Verificar si ya existe un horario para esa semana
        existing = self.db.query(Schedule).filter(
            Schedule.agent_id == agent_id,
            Schedule.week_start == week_start
        ).first()
        
        if existing:
            # Actualizar existente
            existing.week_end = week_end
            existing.monday = monday
            existing.tuesday = tuesday
            existing.wednesday = wednesday
            existing.thursday = thursday
            existing.friday = friday
            existing.saturday = saturday
            existing.sunday = sunday
            self.db.commit()
            self.db.refresh(existing)
            return existing
        
        # Crear nuevo
        schedule = Schedule(
            id=str(uuid.uuid4()),
            agent_id=agent_id,
            week_start=week_start,
            week_end=week_end,
            monday=monday,
            tuesday=tuesday,
            wednesday=wednesday,
            thursday=thursday,
            friday=friday,
            saturday=saturday,
            sunday=sunday
        )
        self.db.add(schedule)
        self.db.commit()
        self.db.refresh(schedule)
        return schedule
    
    def get_weekly_schedule(self, agent_id: str, week_start: datetime) -> Optional[Schedule]:
        """Obtiene el horario semanal completo"""
        return self.db.query(Schedule).filter(
            Schedule.agent_id == agent_id,
            Schedule.week_start == week_start
        ).first()
    
    def get_all_schedules_for_agent(self, agent_id: str) -> List[Schedule]:
        """Obtiene todos los horarios de un agente"""
        return self.db.query(Schedule).filter(
            Schedule.agent_id == agent_id
        ).order_by(Schedule.week_start.desc()).all()