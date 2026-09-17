from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.connection import Base

class Persona(Base):
    __tablename__ = "personas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    activo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    embeddings = relationship("FaceEmbedding", back_populates="persona", cascade="all, delete-orphan")
    recognitions = relationship("RecognitionLog", back_populates="persona")

class FaceEmbedding(Base):
    __tablename__ = "face_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    persona_id = Column(Integer, ForeignKey("personas.id"), nullable=False)
    embedding = Column(JSON, nullable=False)  # Vector de 512 flotantes
    modelo = Column(String(50), default="ArcFace")
    created_at = Column(DateTime, default=datetime.utcnow)

    persona = relationship("Persona", back_populates="embeddings")