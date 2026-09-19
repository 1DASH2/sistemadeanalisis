from fastapi import APIRouter, Depends, UploadFile, File, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.recognition_model import RecognitionLog
from app.schemas.recognition_schema import ResultadoReconocimiento
from app.services.face_service import face_service
from app.services.embedding_service import embedding_service
from app.services.probability_service import probability_service

router = APIRouter()

@router.post("/reconocimiento", response_model=ResultadoReconocimiento)
async def reconocer_rostro(
    file: UploadFile = File(...),
    umbral: float = Query(0.75),
    db: Session = Depends(get_db)
):
    contents = await file.read()
    
    # 1. Extracción de embedding
    target_embedding = face_service.extract_embedding(contents)
    
    # 2. Búsqueda de coincidencia
    match_result = embedding_service.find_matching_face(db, target_embedding, threshold=umbral)
    
    # 3. Calibración de probabilidad ML
    prob_info = probability_service.predict_calibrated_probability(match_result["similitud"])
    prob_calibrada = prob_info["probabilidad_calibrada"]
    
    # 4. Auditoría y log
    log = RecognitionLog(
        persona_id=match_result["persona_id"],
        similitud=match_result["similitud"],
        distancia=match_result["distancia"],
        umbral=umbral,
        coincide=match_result["coincide"],
        probabilidad_calibrada=prob_calibrada
    )
    db.add(log)
    db.commit()

    return {
        **match_result,
        "probabilidad_calibrada": prob_calibrada
    }

@router.get("/reconocimiento/historial")
def obtener_historial(limit: int = 20, db: Session = Depends(get_db)):
    return db.query(RecognitionLog).order_by(RecognitionLog.created_at.desc()).limit(limit).all()