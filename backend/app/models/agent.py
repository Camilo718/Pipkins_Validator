from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import uuid

class Agent(Base):
    __tablename__ = "agents"
    
    # MySQL requiere longitud en String. Usamos 36 para UUID
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    employee_id = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    position = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    schedules = relationship("Schedule", back_populates="agent", cascade="all, delete-orphan")
    attendances = relationship("Attendance", back_populates="agent", cascade="all, delete-orphan")
    discrepancies = relationship("Discrepancy", back_populates="agent", cascade="all, delete-orphan")