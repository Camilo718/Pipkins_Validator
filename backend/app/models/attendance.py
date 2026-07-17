from sqlalchemy import Column, String, DateTime, Float, JSON, UniqueConstraint, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import uuid

class Attendance(Base):
    __tablename__ = "attendances"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # AGREGAR ForeignKey aquí:
    agent_id = Column(String(36), ForeignKey('agents.id'), index=True, nullable=False)
    
    date = Column(DateTime(timezone=True), nullable=False)
    
    scheduled_in = Column(DateTime(timezone=True), nullable=True)
    scheduled_out = Column(DateTime(timezone=True), nullable=True)
    actual_in = Column(DateTime(timezone=True), nullable=True)
    actual_out = Column(DateTime(timezone=True), nullable=True)
    
    scheduled_hours = Column(Float, nullable=True)
    actual_hours = Column(Float, nullable=True)
    
    discrepancies = Column(JSON, nullable=True)
    status = Column(String(50), nullable=False, default="ON_TIME")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    agent = relationship("Agent", back_populates="attendances")
    
    __table_args__ = (
        UniqueConstraint('agent_id', 'date', name='uq_agent_date'),
    )