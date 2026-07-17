from sqlalchemy.orm import Session
from app.models.attendance import Attendance
from app.models.discrepancy import Discrepancy
from app.models.agent import Agent
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
            # Buscar agente por employee_id O por nombre
            agent = self._find_or_create_agent(record.employee_id, record.full_name)
            
            # Obtener horario programado
            schedule_day = self.schedule_service.get_schedule_for_date(
                agent.id, 
                record.date
            )
            
            # Si no hay horario o es día libre, saltar
            if not schedule_day or schedule_day.get("is_off", False):
                continue
            
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
                for key, value in attendance_data.items():
                    setattr(existing, key, value)
                attendance = existing
            else:
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
    
    def _find_or_create_agent(self, employee_id: str, full_name: str) -> Agent:
        """Busca un agente por employee_id o por nombre con coincidencia parcial"""
        # Primero buscar por employee_id exacto
        agent = self.db.query(Agent).filter(Agent.employee_id == employee_id).first()
        if agent:
            return agent
        
        # Buscar por nombre exacto
        agent = self.db.query(Agent).filter(Agent.full_name == full_name).first()
        if agent:
            return agent
        
        # Búsqueda inteligente: extraer palabras clave del nombre del Excel
        # "Correa Lopez, Jefferson Stic" -> buscar "Correa" o "Jefferson"
        excel_words = set(full_name.lower().replace(',', '').split())
        
        all_agents = self.db.query(Agent).all()
        best_match = None
        best_score = 0
        
        for existing_agent in all_agents:
            db_words = set(existing_agent.full_name.lower().split())
            # Contar palabras en común
            common_words = excel_words.intersection(db_words)
            score = len(common_words)
            
            if score > best_score:
                best_score = score
                best_match = existing_agent
        
        # Si hay al menos 2 palabras en común, es el mismo agente
        if best_match and best_score >= 2:
            return best_match
        
        # Si no encuentra match, crear nuevo agente
        agent = Agent(
            id=str(uuid.uuid4()),
            employee_id=employee_id,
            full_name=full_name,
            position="Agent"
        )
        self.db.add(agent)
        self.db.commit()
        self.db.refresh(agent)
        
        return agent
    
    def get_agent_compliance(self, agent_id: str, start_date: datetime, end_date: datetime) -> dict:
        """Obtiene el cumplimiento de un agente en un período con TODOS los detalles"""
        attendances = self.db.query(Attendance).filter(
            Attendance.agent_id == agent_id,
            Attendance.date >= start_date,
            Attendance.date <= end_date
        ).order_by(Attendance.date.asc()).all()
        
        attendances_list = [
            {
                "id": a.id,
                "agent_id": a.agent_id,
                "date": a.date,
                "scheduled_in": a.scheduled_in,
                "scheduled_out": a.scheduled_out,
                "actual_in": a.actual_in,
                "actual_out": a.actual_out,
                "scheduled_hours": a.scheduled_hours,
                "actual_hours": a.actual_hours,
                "status": a.status,
                "discrepancies": a.discrepancies
            }
            for a in attendances
        ]
        
        return {
            "total": len(attendances_list),
            "attendances": attendances_list
        }
    
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
        
        return (end_minutes - start_minutes) / 60.0