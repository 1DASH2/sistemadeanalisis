from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.persona_model import Persona, FaceEmbedding
from app.schemas.persona_schema import PersonaCreate, PersonaResponse
from app.services.face_service import face_service

router = APIRouter()

@router.post("/personas", response_model=PersonaResponse)
def crear_persona(persona: PersonaCreate, db: Session = Depends(get_db)):
    db_persona = db.query(Persona).filter(Persona.email == persona.email).first()
    if db_persona:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    nueva_persona = Persona(nombre=persona.nombre, email=persona.email)
    db.add(nueva_persona)
    db.commit()
    db.refresh(nueva_persona)
    return nueva_persona

@router.post("/personas/{persona_id}/rostro")
async def guardar_rostro_persona(persona_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    persona = db.query(Persona).filter(Persona.id == persona_id).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona no encontrada")
    
    contents = await file.read()
    embedding = face_service.extract_embedding(contents)
    
    nuevo_embedding = FaceEmbedding(persona_id=persona.id, embedding=embedding)
    db.add(nuevo_embedding)
    db.commit()
    
    return {"message": "Embedding facial guardado con éxito", "persona_id": persona.id}

@router.get("/personas", response_model=list[PersonaResponse])
def listar_personas(db: Session = Depends(get_db)):
    return db.query(Persona).all()