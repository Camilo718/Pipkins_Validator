from app.config.database import SessionLocal
from sqlalchemy.orm import Session

def get_db() -> Session:
    """Dependencia para obtener sesión de base de datos"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()