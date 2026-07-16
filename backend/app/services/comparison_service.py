from datetime import datetime, timedelta
from typing import Dict, Any, List

class DiscrepancyResult:
    def __init__(self, type: str, minutes: int, description: str,
                 scheduled_in: datetime, scheduled_out: datetime,
                 actual_in: datetime, actual_out: datetime):
        self.type = type
        self.minutes = minutes
        self.description = description
        self.scheduled_in = scheduled_in
        self.scheduled_out = scheduled_out
        self.actual_in = actual_in
        self.actual_out = actual_out

class ComparisonService:
    def compare_attendance(self, schedule_day: Dict[str, Any], 
                          clock_in: str, clock_out: str, 
                          work_date: datetime) -> DiscrepancyResult:
        """Compara horario programado vs real"""
        
        # Parsear horarios
        scheduled_in = self._parse_time_to_datetime(schedule_day["start"], work_date)
        scheduled_out = self._parse_time_to_datetime(schedule_day["end"], work_date)
        actual_in = self._parse_time_to_datetime(clock_in, work_date)
        actual_out = self._parse_time_to_datetime(clock_out, work_date)
        
        # Calcular diferencias en minutos
        late_minutes = int((actual_in - scheduled_in).total_seconds() / 60)
        early_departure_minutes = int((actual_out - scheduled_out).total_seconds() / 60)
        
        # Determinar tipo de discrepancia
        if late_minutes > 0 and early_departure_minutes < 0:
            return DiscrepancyResult(
                type="LATE_ARRIVAL",
                minutes=late_minutes,
                description=f"Llegó {late_minutes} minutos tarde y salió {abs(early_departure_minutes)} minutos antes",
                scheduled_in=scheduled_in,
                scheduled_out=scheduled_out,
                actual_in=actual_in,
                actual_out=actual_out
            )
        elif late_minutes > 0:
            return DiscrepancyResult(
                type="LATE_ARRIVAL",
                minutes=late_minutes,
                description=f"Llegó {late_minutes} minutos tarde",
                scheduled_in=scheduled_in,
                scheduled_out=scheduled_out,
                actual_in=actual_in,
                actual_out=actual_out
            )
        elif early_departure_minutes < 0:
            return DiscrepancyResult(
                type="EARLY_DEPARTURE",
                minutes=abs(early_departure_minutes),
                description=f"Salió {abs(early_departure_minutes)} minutos antes",
                scheduled_in=scheduled_in,
                scheduled_out=scheduled_out,
                actual_in=actual_in,
                actual_out=actual_out
            )
        elif late_minutes < -60:  # Llegó más de 1 hora antes (horas extra)
            return DiscrepancyResult(
                type="OVERTIME",
                minutes=abs(late_minutes),
                description=f"Llegó {abs(late_minutes)} minutos antes (horas extra)",
                scheduled_in=scheduled_in,
                scheduled_out=scheduled_out,
                actual_in=actual_in,
                actual_out=actual_out
            )
        
        return DiscrepancyResult(
            type="ON_TIME",
            minutes=0,
            description="Cumplió el horario correctamente",
            scheduled_in=scheduled_in,
            scheduled_out=scheduled_out,
            actual_in=actual_in,
            actual_out=actual_out
        )
    
    def _parse_time_to_datetime(self, time_str: str, work_date: datetime) -> datetime:
        """Convierte string HH:MM a datetime"""
        if not time_str or time_str == "--":
            return work_date
        
        parts = str(time_str).split(":")
        hours = int(parts[0])
        minutes = int(parts[1])
        
        return work_date.replace(hour=hours, minute=minutes, second=0, microsecond=0)
    
    def calculate_weekly_compliance(self, attendances: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calcula el cumplimiento semanal"""
        total_days = len(attendances)
        if total_days == 0:
            return {
                "compliance_rate": 0.0,
                "total_days": 0,
                "on_time_days": 0,
                "late_days": 0,
                "early_departure_days": 0,
                "total_late_minutes": 0,
                "average_late_minutes": 0.0
            }
        
        on_time_days = sum(1 for a in attendances if a.get("status") == "ON_TIME")
        late_days = sum(1 for a in attendances if a.get("status") == "LATE_ARRIVAL")
        early_departure_days = sum(1 for a in attendances if a.get("status") == "EARLY_DEPARTURE")
        
        total_late_minutes = sum(
            a.get("discrepancies", {}).get("minutes", 0) 
            for a in attendances 
            if a.get("discrepancies")
        )
        
        return {
            "compliance_rate": round((on_time_days / total_days) * 100, 2),
            "total_days": total_days,
            "on_time_days": on_time_days,
            "late_days": late_days,
            "early_departure_days": early_departure_days,
            "total_late_minutes": total_late_minutes,
            "average_late_minutes": round(total_late_minutes / late_days, 2) if late_days > 0 else 0.0
        }