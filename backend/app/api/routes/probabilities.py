from fastapi import APIRouter
from app.schemas.recognition_schema import ProbabilidadPrediccionRequest, ProbabilidadPrediccionResponse
from app.services.probability_service import probability_service

router = APIRouter()

@router.post("/probabilidades/prediccion", response_model=ProbabilidadPrediccionResponse)
def predecir_probabilidad(data: ProbabilidadPrediccionRequest):
    resultado = probability_service.predict_calibrated_probability(
        similitud=data.similitud,
        calidad_imagen=data.calidad_imagen,
        iluminacion=data.iluminacion
    )
    return resultado