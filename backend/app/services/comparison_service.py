from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from dataclasses import dataclass

@dataclass
class AttendanceComparison:
    scheduled_in: Optional[datetime]
    scheduled_out: Optional[datetime]
    actual_in: Optional[datetime]
    actual_out: Optional[datetime]
    type: str  # ON_TIME, LATE_ARRIVAL, EARLY_DEPARTURE, ABSENT, OVERTIME, DAY_OFF
    minutes: int
    description: str

class ComparisonService:
    def compare_attendance(
        self,
        schedule_day: Dict[str, Any],
        clock_in: str,
        clock_out: str,
        date: datetime
    ) -> AttendanceComparison:
        """Compara el horario programado vs el real"""
        
        # ✅ DETECTAR DÍAS LIBRES DESDE EL EXCEL
        if (clock_in == "--" or not clock_in) and (clock_out == "--" or not clock_out):
            # El Excel dice que es día libre
            return AttendanceComparison(
                scheduled_in=None,
                scheduled_out=None,
                actual_in=None,
                actual_out=None,
                type="DAY_OFF",
                minutes=0,
                description="Día libre"
            )
        
        # Parsear horas programadas
        scheduled_start = schedule_day.get("start", "00:00")
        scheduled_end = schedule_day.get("end", "00:00")
        is_off = schedule_day.get("isOff", False)
        
        # Si el horario dice que es día libre
        if is_off or scheduled_start == "00:00" and scheduled_end == "00:00":
            return AttendanceComparison(
                scheduled_in=None,
                scheduled_out=None,
                actual_in=self._parse_time(clock_in, date),
                actual_out=self._parse_time(clock_out, date),
                type="DAY_OFF",
                minutes=0,
                description="Día libre programado"
            )
        
        # Parsear horas
        scheduled_in = self._parse_schedule_time(scheduled_start, date)
        scheduled_out = self._parse_schedule_time(scheduled_end, date)
        actual_in = self._parse_time(clock_in, date)
        actual_out = self._parse_time(clock_out, date)
        
        # Calcular discrepancias
        discrepancies = []
        total_minutes = 0
        
        # Verificar llegada tarde
        if actual_in and scheduled_in:
            diff_minutes = int((actual_in - scheduled_in).total_seconds() / 60)
            if diff_minutes > 0:
                discrepancies.append(f"Llegó {diff_minutes} minutos tarde")
                total_minutes += diff_minutes
        
        # Verificar salida temprana
        if actual_out and scheduled_out:
            diff_minutes = int((scheduled_out - actual_out).total_seconds() / 60)
            if diff_minutes > 0:
                discrepancies.append(f"salió {diff_minutes} minutos antes")
                total_minutes += diff_minutes
        
        # Determinar tipo
        if not discrepancies:
            comp_type = "ON_TIME"
            description = "Cumplió el horario correctamente"
        elif len(discrepancies) == 2:
            comp_type = "LATE_ARRIVAL"  # O EARLY_DEPARTURE, dependiendo del contexto
            description = f"{discrepancies[0].capitalize()} y {discrepancies[1]}"
        else:
            if "tarde" in discrepancies[0]:
                comp_type = "LATE_ARRIVAL"
            else:
                comp_type = "EARLY_DEPARTURE"
            description = discrepancies[0].capitalize()
        
        return AttendanceComparison(
            scheduled_in=scheduled_in,
            scheduled_out=scheduled_out,
            actual_in=actual_in,
            actual_out=actual_out,
            type=comp_type,
            minutes=abs(total_minutes),
            description=description
        )
    
    def _parse_time(self, time_str: str, date: datetime) -> Optional[datetime]:
        """Parsea una hora del Excel (formato 24h ya convertido)"""
        if time_str == "--" or not time_str:
            return None
        
        try:
            parts = time_str.split(":")
            if len(parts) >= 2:
                hour = int(parts[0])
                minute = int(parts[1])
                second = int(parts[2]) if len(parts) > 2 else 0
                
                return date.replace(hour=hour, minute=minute, second=second)
        except:
            pass
        
        return None
    
    def _parse_schedule_time(self, time_str: str, date: datetime) -> Optional[datetime]:
        """Parsea una hora del horario programado"""
        if not time_str or time_str == "00:00":
            return None
        
        try:
            parts = time_str.split(":")
            if len(parts) >= 2:
                hour = int(parts[0])
                minute = int(parts[1])
                
                return date.replace(hour=hour, minute=minute, second=0)
        except:
            pass
        
        return None
    
    def calculate_weekly_compliance(self, attendances: list) -> dict:
        """Calcula el cumplimiento semanal"""
        total = len(attendances)
        on_time = sum(1 for a in attendances if a.get("status") == "ON_TIME")
        late = sum(1 for a in attendances if a.get("status") in ["LATE_ARRIVAL", "EARLY_DEPARTURE"])
        day_off = sum(1 for a in attendances if a.get("status") == "DAY_OFF")
        
        return {
            "total_days": total,
            "on_time": on_time,
            "late": late,
            "day_off": day_off,
            "compliance_rate": (on_time / total * 100) if total > 0 else 0
        }