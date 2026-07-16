from sqlalchemy import Column, String, DateTime, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import uuid

class Schedule(Base):
    __tablename__ = "schedules"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    agent_id = Column(String(36), index=True, nullable=False)
    week_start = Column(DateTime(timezone=True), nullable=False)
    week_end = Column(DateTime(timezone=True), nullable=False)
    
    # Horarios por día (JSON)
    monday = Column(JSON, nullable=True)
    tuesday = Column(JSON, nullable=True)
    wednesday = Column(JSON, nullable=True)
    thursday = Column(JSON, nullable=True)
    friday = Column(JSON, nullable=True)
    saturday = Column(JSON, nullable=True)
    sunday = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    agent = relationship("Agent", back_populates="schedules")
    
    __table_args__ = (
        UniqueConstraint('agent_id', 'week_start', name='uq_agent_week'),
    )