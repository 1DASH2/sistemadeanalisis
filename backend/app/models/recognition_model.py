from sqlalchemy import Column, Integer, Float, Boolean, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.connection import Base

class RecognitionLog(Base):
    __tablename__ = "recognition_logs"

    id = Column(Integer, primary_key=True, index=True)
    persona_id = Column(Integer, ForeignKey("personas.id"), nullable=True)
    similitud = Column(Float, nullable=False)
    distancia = Column(Float, nullable=False)
    umbral = Column(Float, default=0.75)
    coincide = Column(Boolean, nullable=False)
    probabilidad_calibrada = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    persona = relationship("Persona", back_populates="recognitions")

class MLTrainingRecord(Base):
    __tablename__ = "ml_training_records"

    id = Column(Integer, primary_key=True, index=True)
    similitud = Column(Float, nullable=False)
    calidad_imagen = Column(Float, nullable=False)
    iluminacion = Column(Float, nullable=False)
    resultado_real = Column(Boolean, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)