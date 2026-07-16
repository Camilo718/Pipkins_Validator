from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.models.discrepancy import Discrepancy
from app.models.attendance import Attendance
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/discrepancies")
def get_discrepancies(
    agent_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    discrepancy_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Obtiene todas las discrepancias con filtros opcionales
    
    - **agent_id**: Filtrar por agente
    - **start_date**: Fecha de inicio
    - **end_date**: Fecha de fin
    - **discrepancy_type**: Tipo de discrepancia (LATE_ARRIVAL, EARLY_DEPARTURE, etc.)
    """
    try:
        query = db.query(Discrepancy)
        
        if agent_id:
            query = query.filter(Discrepancy.agent_id == agent_id)
        if start_date:
            query = query.filter(Discrepancy.date >= datetime.fromisoformat(start_date))
        if end_date:
            query = query.filter(Discrepancy.date <= datetime.fromisoformat(end_date))
        if discrepancy_type:
            query = query.filter(Discrepancy.type == discrepancy_type)
        
        discrepancies = query.order_by(Discrepancy.date.desc()).all()
        
        return {
            "total": len(discrepancies),
            "data": [
                {
                    "id": d.id,
                    "agent_id": d.agent_id,
                    "date": d.date,
                    "type": d.type,
                    "minutes": d.minutes,
                    "description": d.description,
                    "created_at": d.created_at
                }
                for d in discrepancies
            ]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Formato de fecha inválido: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/summary")
def get_summary_report(
    start_date: str,
    end_date: str,
    db: Session = Depends(get_db)
):
    """
    Obtiene un reporte resumen del período
    """
    try:
        from app.models.agent import Agent
        
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)
        
        # Total de agentes
        total_agents = db.query(Agent).count()
        
        # Total de asistencias
        total_attendances = db.query(Attendance).filter(
            Attendance.date >= start,
            Attendance.date <= end
        ).count()
        
        # Total de discrepancias
        total_discrepancies = db.query(Discrepancy).filter(
            Discrepancy.date >= start,
            Discrepancy.date <= end
        ).count()
        
        # Discrepancias por tipo
        discrepancies_by_type = db.query(
            Discrepancy.type,
            db.func.count(Discrepancy.id).label('count')
        ).filter(
            Discrepancy.date >= start,
            Discrepancy.date <= end
        ).group_by(Discrepancy.type).all()
        
        # Total minutos de retraso
        total_late_minutes = db.query(
            db.func.sum(Discrepancy.minutes)
        ).filter(
            Discrepancy.type == "LATE_ARRIVAL",
            Discrepancy.date >= start,
            Discrepancy.date <= end
        ).scalar() or 0
        
        return {
            "period": {
                "start_date": start_date,
                "end_date": end_date
            },
            "summary": {
                "total_agents": total_agents,
                "total_attendances": total_attendances,
                "total_discrepancies": total_discrepancies,
                "total_late_minutes": total_late_minutes
            },
            "discrepancies_by_type": [
                {"type": d.type, "count": d.count}
                for d in discrepancies_by_type
            ]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Formato de fecha inválido: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))