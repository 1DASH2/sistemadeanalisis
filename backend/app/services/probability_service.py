import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.isotonic import IsotonicRegression
import joblib
import os

class ProbabilityService:
    def __init__(self):
        self.model_path = "models/probability_model.pkl"
        self.model = None
        self._load_or_create_default_model()

    def _load_or_create_default_model(self):
        """Carga el modelo preentrenado o entrena uno base si no existe."""
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
        else:
            # Modelo sintético de calibración inicial (Regresión Logística / Sigmoide)
            # Entrada X: [similitud, calidad_imagen, iluminacion]
            X_dummy = np.array([
                [0.95, 0.9, 0.85], # Coincidencia casi perfecta
                [0.85, 0.8, 0.75], # Buena coincidencia
                [0.72, 0.7, 0.60], # Zona limítrofe (umbral)
                [0.50, 0.8, 0.80], # Distintos con buena luz
                [0.30, 0.5, 0.40]  # Distintos con mala luz
            ])
            y_dummy = np.array([1, 1, 1, 0, 0])

            self.model = LogisticRegression()
            self.model.fit(X_dummy, y_dummy)

    def predict_calibrated_probability(self, similitud: float, calidad_imagen: float = 0.85, iluminacion: float = 0.80) -> dict:
        """
        Calcula la probabilidad calibrada de que dos rostros pertenezcan a la misma persona
        evaluando la similitud y las condiciones de la toma.
        """
        features = np.array([[similitud, calidad_imagen, iluminacion]])
        
        # Obtener probabilidad de la clase positiva (Coincidencia real)
        prob_array = self.model.predict_proba(features)
        probabilidad_calibrada = float(prob_array[0][1])

        # Asignar nivel de confianza cualitativo
        if probabilidad_calibrada >= 0.85:
            nivel_confianza = "Alto"
        elif probabilidad_calibrada >= 0.60:
            nivel_confianza = "Medio"
        else:
            nivel_confianza = "Bajo"

        return {
            "probabilidad_calibrada": round(probabilidad_calibrada, 4),
            "nivel_confianza": nivel_confianza
        }

    def retrain_model(self, X_train: list, y_train: list):
        """Entrena y actualiza el modelo con el dataset de comparaciones históricas."""
        X = np.array(X_train)
        y = np.array(y_train)

        self.model = LogisticRegression()
        self.model.fit(X, y)

        # Crear directorio si no existe y guardar modelo
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)

probability_service = ProbabilityService()