from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import uuid

class Discrepancy(Base):
    __tablename__ = "discrepancies"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    agent_id = Column(String(36), ForeignKey('agents.id'), index=True, nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    type = Column(String(50), nullable=False)  # LATE_ARRIVAL, EARLY_DEPARTURE, ABSENT, OVERTIME
    minutes = Column(Integer, nullable=False)
    description = Column(Text, nullable=False) # Usamos Text para descripciones largas
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    agent = relationship("Agent", back_populates="discrepancies")