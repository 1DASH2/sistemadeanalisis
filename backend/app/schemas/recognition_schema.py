from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ResultadoReconocimiento(BaseModel):
    persona_id: Optional[int] = None
    nombre: Optional[str] = "Desconocido"
    similitud: float
    distancia: float
    umbral: float
    coincide: bool
    probabilidad_calibrada: float

class ProbabilidadPrediccionRequest(BaseModel):
    similitud: float
    calidad_imagen: float
    iluminacion: float

class ProbabilidadPrediccionResponse(BaseModel):
    probabilidad_calibrada: float
    nivel_confianza: str