from fastapi import FastAPI
from app.database.connection import engine, Base
from app.models import persona_model, recognition_model

# Crear automáticamente las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sistema de Reconocimiento Facial")