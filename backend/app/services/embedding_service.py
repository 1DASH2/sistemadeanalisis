from sqlalchemy.orm import Session
from app.models.persona_model import FaceEmbedding, Persona
from app.services.face_service import face_service

class EmbeddingService:
    @staticmethod
    def find_matching_face(db: Session, target_embedding: list[float], threshold: float = 0.75):
        """
        Compara el embedding capturado contra todos los embeddings de la base de datos.
        Retorna la persona con mayor similitud si supera el umbral.
        """
        embeddings_db = db.query(FaceEmbedding).all()

        best_match_persona = None
        highest_similarity = 0.0
        lowest_distance = 1.0

        for record in embeddings_db:
            similarity, distance = face_service.calculate_metrics(target_embedding, record.embedding)

            if similarity > highest_similarity:
                highest_similarity = similarity
                lowest_distance = distance
                best_match_persona = db.query(Persona).filter(Persona.id == record.persona_id).first()

        coincide = highest_similarity >= threshold

        return {
            "persona_id": best_match_persona.id if best_match_persona and coincide else None,
            "nombre": best_match_persona.nombre if best_match_persona and coincide else "Desconocido",
            "similitud": highest_similarity,
            "distancia": lowest_distance,
            "umbral": threshold,
            "coincide": coincide
        }

embedding_service = EmbeddingService()