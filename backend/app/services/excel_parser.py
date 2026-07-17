import openpyxl
from datetime import datetime
from typing import List, Dict, Any
from io import BytesIO

class AttendanceRecord:
    def __init__(self, employee_id: str, full_name: str, date: datetime, 
                 clock_in: str, clock_out: str, paid_duration: str):
        self.employee_id = employee_id
        self.full_name = full_name
        self.date = date
        self.clock_in = clock_in
        self.clock_out = clock_out
        self.paid_duration = paid_duration

class ExcelParserService:
    def parse_file(self, file_content: bytes) -> List[AttendanceRecord]:
        """Parsea el archivo Excel de Pipkins"""
        wb = openpyxl.load_workbook(filename=BytesIO(file_content), read_only=True, data_only=True)
        ws = wb.active
        
        records = []
        current_employee_id = ""
        current_name = ""
        header_row_found = False
        
        for row in ws.iter_rows(values_only=True):
            if not row:
                continue
            
            cells = [str(cell).strip() if cell is not None else "" for cell in row]
            
            if "Agent:" in cells[0] and "Date" in cells[1]:
                header_row_found = True
                continue
            
            if not header_row_found:
                continue
            
            if cells[0] and ',' in cells[0] and cells[1]:
                current_name = cells[0]
                current_employee_id = current_name
            
            if not current_name:
                continue
            
            if cells[1] and self._is_valid_date(cells[1]):
                date = self._parse_date(cells[1])
                clock_in = cells[2] if cells[2] else "--"
                clock_out = cells[3] if cells[3] else "--"
                paid_duration = cells[4] if cells[4] else "00:00:00"
                
                if "Daily Total" in cells[1] or "Agent Total" in cells[1]:
                    break
                
                # ✅ CONVERTIR HORAS AM/PM A FORMATO 24H ANTES DE GUARDAR
                clock_in_24h = self._convert_to_24h(clock_in)
                clock_out_24h = self._convert_to_24h(clock_out)
                
                records.append(AttendanceRecord(
                    employee_id=current_employee_id,
                    full_name=current_name,
                    date=date,
                    clock_in=clock_in_24h,
                    clock_out=clock_out_24h,
                    paid_duration=paid_duration
                ))
        
        wb.close()
        return records
    
    def _convert_to_24h(self, time_str: str) -> str:
        """Convierte 05:00:00PM a 17:00:00 y 07:00:00AM a 07:00:00"""
        if time_str == "--" or not time_str:
            return "--"
        
        time_str = str(time_str).strip().upper()
        
        # Si ya está en formato 24h, devolver tal cual
        if "AM" not in time_str and "PM" not in time_str:
            return time_str
        
        is_pm = "PM" in time_str
        time_part = time_str.replace("AM", "").replace("PM", "").strip()
        parts = time_part.split(":")
        
        if len(parts) < 2:
            return time_str
        
        try:
            hour = int(parts[0])
            minute = int(parts[1]) if len(parts) > 1 else 0
            second = int(parts[2]) if len(parts) > 2 else 0
            
            # Convertir a 24h
            if is_pm and hour != 12:
                hour += 12
            elif not is_pm and hour == 12:
                hour = 0
            
            return f"{hour:02d}:{minute:02d}:{second:02d}"
        except:
            return time_str
    
    def _is_valid_date(self, value) -> bool:
        if isinstance(value, datetime):
            return True
        
        value_str = str(value).strip()
        formats = [
            "%m-%d-%Y",
            "%m/%d/%Y",
            "%Y-%m-%d",
            "%m-%d-%Y %H:%M:%S",
            "%m/%d/%Y %H:%M:%S",
        ]
        
        for fmt in formats:
            try:
                datetime.strptime(value_str, fmt)
                return True
            except:
                continue
        
        return False
    
    def _parse_date(self, value) -> datetime:
        if isinstance(value, datetime):
            return value
        
        value_str = str(value).strip()
        formats = [
            "%m-%d-%Y",
            "%m/%d/%Y",
            "%Y-%m-%d",
            "%m-%d-%Y %H:%M:%S",
            "%m/%d/%Y %H:%M:%S",
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(value_str, fmt)
            except:
                continue
        
        raise ValueError(f"No se pudo parsear la fecha: {value_str}")
    
    def parse_time(self, time_str: str) -> Dict[str, int]:
        """Parsea un string de tiempo HH:MM:SS (ya en formato 24h)"""
        if time_str == "--" or not time_str:
            return None
        
        parts = str(time_str).split(":")
        if len(parts) >= 2:
            try:
                return {
                    "hours": int(parts[0]),
                    "minutes": int(parts[1]),
                    "seconds": int(parts[2]) if len(parts) > 2 else 0
                }
            except:
                return None
        return None
    
    def parse_duration_to_hours(self, duration: str) -> float:
        if not duration or duration == "--":
            return 0.0
        
        parts = str(duration).split(":")
        if len(parts) == 3:
            hours = int(parts[0])
            minutes = int(parts[1])
            return hours + (minutes / 60)
        return 0.0