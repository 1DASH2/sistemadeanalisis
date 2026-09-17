from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class PersonaBase(BaseModel):
    nombre: str
    email: EmailStr

class PersonaCreate(PersonaBase):
    pass

class PersonaResponse(PersonaBase):
    id: int
    activo: bool
    created_at: datetime

    class Config:
        from_attributes = True