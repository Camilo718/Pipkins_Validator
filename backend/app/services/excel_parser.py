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
        
        # Saltar las primeras 5 filas (headers)
        for row_idx, row in enumerate(ws.iter_rows(min_row=6, values_only=True), start=6):
            if not row or not row[0]:
                continue
            
            cell_value = str(row[0]).strip() if row[0] else ""
            
            # Detectar nuevo empleado (formato: "LastName, FirstName")
            if ',' in cell_value and row[1]:
                parts = cell_value.split(',')
                current_employee_id = parts[0].strip()
                current_name = cell_value.strip()
            
            # Procesar filas de asistencia
            if row[1] and self._is_valid_date(row[1]):
                date = self._parse_date(row[1])
                clock_in = str(row[2]).strip() if row[2] else "--"
                clock_out = str(row[3]).strip() if row[3] else "--"
                paid_duration = str(row[4]).strip() if row[4] else "00:00:00"
                
                # Solo agregar si hay clock in y clock out válidos
                if clock_in != "--" and clock_out != "--" and clock_in and clock_out:
                    records.append(AttendanceRecord(
                        employee_id=current_employee_id,
                        full_name=current_name,
                        date=date,
                        clock_in=clock_in,
                        clock_out=clock_out,
                        paid_duration=paid_duration
                    ))
            
            # Detener en "Daily Total" o "Agent Total"
            if "Daily Total" in cell_value or "Agent Total" in cell_value:
                break
        
        wb.close()
        return records
    
    def _is_valid_date(self, value) -> bool:
        """Verifica si el valor es una fecha válida"""
        if isinstance(value, datetime):
            return True
        try:
            datetime.strptime(str(value), "%Y-%m-%d %H:%M:%S")
            return True
        except:
            return False
    
    def _parse_date(self, value) -> datetime:
        """Parsea una fecha desde Excel"""
        if isinstance(value, datetime):
            return value
        return datetime.strptime(str(value), "%Y-%m-%d %H:%M:%S")
    
    def parse_time(self, time_str: str) -> Dict[str, int]:
        """Parsea un string de tiempo HH:MM:SS"""
        if time_str == "--" or not time_str:
            return None
        
        parts = str(time_str).split(":")
        if len(parts) >= 2:
            return {
                "hours": int(parts[0]),
                "minutes": int(parts[1])
            }
        return None
    
    def parse_duration_to_hours(self, duration: str) -> float:
        """Convierte HH:MM:SS a horas decimales"""
        if not duration or duration == "--":
            return 0.0
        
        parts = str(duration).split(":")
        if len(parts) == 3:
            hours = int(parts[0])
            minutes = int(parts[1])
            return hours + (minutes / 60)
        return 0.0