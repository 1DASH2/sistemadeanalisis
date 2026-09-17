import cv2
import numpy as np
import insightface
from insightface.app import FaceAnalysis
from fastapi import HTTPException

class FaceService:
    def __init__(self):
        # Carga el modelo ArcFace/InsightFace (buffalo_l es el paquete ligero estándar)
        # ctx_id=0 para GPU, ctx_id=-1 para CPU
        self.app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
        self.app.prepare(ctx_id=-1, det_size=(640, 640))

    def extract_embedding(self, image_bytes: bytes) -> list[float]:
        """
        Recibe la imagen recibida del frontend en bytes, detecta el rostro 
        y retorna un vector de embedding de 512 dimensiones.
        """
        # Convertir bytes a un arreglo de NumPy (OpenCV BGR)
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Formato de imagen inválido o no se pudo decodificar.")

        # Detección y extracción de características
        faces = self.app.get(img)

        if len(faces) == 0:
            raise HTTPException(status_code=422, detail="No se detectó ningún rostro en la imagen.")
        
        if len(faces) > 1:
            # Tomamos el rostro con mayor área/confianza para evitar ambigüedades
            faces = sorted(faces, key=lambda x: (x.bbox[2] - x.bbox[0]) * (x.bbox[3] - x.bbox[1]), reverse=True)

        # Extraer vector numérico (512 float values)
        embedding = faces[0].embedding
        
        # Normalizar vector L2 para facilitar comparaciones
        embedding = embedding / np.linalg.norm(embedding)
        
        return embedding.tolist()

    @staticmethod
    def calculate_metrics(embedding1: list[float], embedding2: list[float]) -> tuple[float, float]:
        """
        Calcula la Similitud Coseno y la Distancia Euclidiana entre dos embeddings.
        """
        vec1 = np.array(embedding1, dtype=np.float32)
        vec2 = np.array(embedding2, dtype=np.float32)

        # Similitud Coseno
        dot_product = np.dot(vec1, vec2)
        norm_a = np.linalg.norm(vec1)
        norm_b = np.linalg.norm(vec2)
        similarity = float(dot_product / (norm_a * norm_b))

        # Distancia Euclidiana
        distance = float(np.linalg.norm(vec1 - vec2))

        return round(similarity, 4), round(distance, 4)

face_service = FaceService()