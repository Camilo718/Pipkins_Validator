from sqlalchemy.orm import Session
from app.models.attendance import Attendance
from app.models.discrepancy import Discrepancy
from app.services.excel_parser import ExcelParserService
from app.services.comparison_service import ComparisonService
from app.services.agent_service import AgentService
from app.services.schedule_service import ScheduleService
from datetime import datetime
from typing import List, Dict, Any
import uuid

class AttendanceService:
    def __init__(self, db: Session):
        self.db = db
        self.excel_parser = ExcelParserService()
        self.comparison_service = ComparisonService()
        self.agent_service = AgentService(db)
        self.schedule_service = ScheduleService(db)
    
    def process_excel_file(self, file_content: bytes) -> dict:
        """Procesa el archivo Excel y guarda las asistencias"""
        records = self.excel_parser.parse_file(file_content)
        
        processed_records = []
        discrepancies_found = []
        
        for record in records:
            # Buscar o crear agente
            agent = self.agent_service.get_or_create_agent(
                record.employee_id, 
                record.full_name
            )
            
            # Obtener horario programado
            schedule_day = self.schedule_service.get_schedule_for_date(
                agent.id, 
                record.date
            )
            
            if schedule_day and not schedule_day.get("is_off", False):
                # Comparar horarios
                discrepancy = self.comparison_service.compare_attendance(
                    schedule_day,
                    record.clock_in,
                    record.clock_out,
                    record.date
                )
                
                # Calcular horas
                scheduled_hours = self._calculate_hours(
                    schedule_day["start"], 
                    schedule_day["end"]
                )
                actual_hours = self.excel_parser.parse_duration_to_hours(
                    record.paid_duration
                )
                
                # Crear/Actualizar asistencia
                attendance_data = {
                    "agent_id": agent.id,
                    "date": record.date,
                    "scheduled_in": discrepancy.scheduled_in,
                    "scheduled_out": discrepancy.scheduled_out,
                    "actual_in": discrepancy.actual_in,
                    "actual_out": discrepancy.actual_out,
                    "scheduled_hours": scheduled_hours,
                    "actual_hours": actual_hours,
                    "discrepancies": {
                        "type": discrepancy.type,
                        "minutes": discrepancy.minutes,
                        "description": discrepancy.description
                    },
                    "status": discrepancy.type
                }
                
                # Verificar si ya existe
                existing = self.db.query(Attendance).filter(
                    Attendance.agent_id == agent.id,
                    Attendance.date == record.date
                ).first()
                
                if existing:
                    # Actualizar existente
                    for key, value in attendance_data.items():
                        setattr(existing, key, value)
                    attendance = existing
                else:
                    # Crear nuevo
                    attendance = Attendance(
                        id=str(uuid.uuid4()),
                        **attendance_data
                    )
                    self.db.add(attendance)
                
                # Guardar discrepancia si existe
                if discrepancy.type != "ON_TIME":
                    disc = Discrepancy(
                        id=str(uuid.uuid4()),
                        agent_id=agent.id,
                        date=record.date,
                        type=discrepancy.type,
                        minutes=discrepancy.minutes,
                        description=discrepancy.description
                    )
                    self.db.add(disc)
                    discrepancies_found.append(disc)
                
                processed_records.append(attendance)
        
        self.db.commit()
        
        return {
            "total_records": len(processed_records),
            "discrepancies": len(discrepancies_found),
            "data": processed_records
        }
    
    def get_agent_compliance(self, agent_id: str, start_date: datetime, 
                            end_date: datetime) -> dict:
        """Obtiene el cumplimiento de un agente en un período"""
        attendances = self.db.query(Attendance).filter(
            Attendance.agent_id == agent_id,
            Attendance.date >= start_date,
            Attendance.date <= end_date
        ).all()
        
        attendances_list = [
            {
                "status": a.status,
                "discrepancies": a.discrepancies
            }
            for a in attendances
        ]
        
        return self.comparison_service.calculate_weekly_compliance(attendances_list)
    
    def get_all_attendances(self, agent_id: str = None, 
                           start_date: datetime = None,
                           end_date: datetime = None) -> List[Attendance]:
        """Obtiene asistencias con filtros opcionales"""
        query = self.db.query(Attendance)
        
        if agent_id:
            query = query.filter(Attendance.agent_id == agent_id)
        if start_date:
            query = query.filter(Attendance.date >= start_date)
        if end_date:
            query = query.filter(Attendance.date <= end_date)
        
        return query.order_by(Attendance.date.desc()).all()
    
    def _calculate_hours(self, start: str, end: str) -> float:
        """Calcula horas entre dos tiempos"""
        if not start or not end or start == "--" or end == "--":
            return 0.0
        
        start_parts = start.split(":")
        end_parts = end.split(":")
        
        start_minutes = int(start_parts[0]) * 60 + int(start_parts[1])
        end_minutes = int(end_parts[0]) * 60 + int(end_parts[1])
        
        return (end_minutes - start_minutes) / 60