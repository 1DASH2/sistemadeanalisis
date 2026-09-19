from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.connection import engine, Base
from app.api.routes import health, personas, recognition, probabilities

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(personas.router, prefix="/api", tags=["Personas"])
app.include_router(recognition.router, prefix="/api", tags=["Reconocimiento"])
app.include_router(probabilities.router, prefix="/api", tags=["Probabilidades"])