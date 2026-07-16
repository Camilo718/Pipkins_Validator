from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.services.attendance_service import AttendanceService
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.post("/upload")
async def upload_excel(
    file: UploadFile = File(..., description="Archivo Excel de Pipkins"),
    start_date: str = Form(..., description="Fecha de inicio (YYYY-MM-DD)"),
    end_date: str = Form(..., description="Fecha de fin (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    """
    Sube y procesa un archivo Excel de Pipkins
    
    - **file**: Archivo Excel exportado desde Pipkins
    - **start_date**: Fecha de inicio del período
    - **end_date**: Fecha de fin del período
    """
    try:
        # Validar archivo
        if not file.filename.endswith(('.xlsx', '.xls')):
            raise HTTPException(status_code=400, detail="Solo se permiten archivos Excel (.xlsx, .xls)")
        
        # Leer contenido del archivo
        file_content = await file.read()
        
        # Procesar archivo
        service = AttendanceService(db)
        result = service.process_excel_file(file_content)
        
        return {
            "message": "Excel procesado exitosamente",
            "total_records": result["total_records"],
            "discrepancies": result["discrepancies"],
            "data": [
                {
                    "id": a.id,
                    "agent_id": a.agent_id,
                    "date": a.date,
                    "status": a.status,
                    "scheduled_hours": a.scheduled_hours,
                    "actual_hours": a.actual_hours,
                    "discrepancies": a.discrepancies
                }
                for a in result["data"]
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando el archivo: {str(e)}")

@router.get("/agent/{agent_id}/compliance")
def get_agent_compliance(
    agent_id: str,
    start_date: str,
    end_date: str,
    db: Session = Depends(get_db)
):
    """
    Obtiene el cumplimiento de un agente en un período específico
    """
    try:
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)
        
        service = AttendanceService(db)
        compliance = service.get_agent_compliance(agent_id, start, end)
        
        return {
            "agent_id": agent_id,
            "period": {
                "start_date": start_date,
                "end_date": end_date
            },
            "compliance": compliance
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Formato de fecha inválido: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/all-agents/compliance")
def get_all_agents_compliance(
    start_date: str,
    end_date: str,
    db: Session = Depends(get_db)
):
    """
    Obtiene el cumplimiento de todos los agentes en un período
    """
    try:
        from app.models.agent import Agent
        
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)
        
        agents = db.query(Agent).all()
        service = AttendanceService(db)
        
        report = []
        for agent in agents:
            compliance = service.get_agent_compliance(agent.id, start, end)
            report.append({
                "agent": {
                    "id": agent.id,
                    "full_name": agent.full_name,
                    "employee_id": agent.employee_id
                },
                "compliance": compliance
            })
        
        return {
            "period": {
                "start_date": start_date,
                "end_date": end_date
            },
            "total_agents": len(report),
            "data": report
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Formato de fecha inválido: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
def get_attendances(
    agent_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Obtiene lista de asistencias con filtros opcionales
    """
    try:
        service = AttendanceService(db)
        
        start = datetime.fromisoformat(start_date) if start_date else None
        end = datetime.fromisoformat(end_date) if end_date else None
        
        attendances = service.get_all_attendances(agent_id, start, end)
        
        return {
            "total": len(attendances),
            "data": [
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
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))