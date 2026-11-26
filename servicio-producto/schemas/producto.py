from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ProductoCreate(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=20)
    descripcion: str = Field(..., min_length=1)
    precio: float = Field(..., ge=0)
    stock: int = Field(..., ge=0)


class ProductoUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=1, max_length=20)
    descripcion: Optional[str] = Field(None, min_length=1)
    precio: Optional[float] = Field(None, ge=0)
    stock: Optional[int] = Field(None, ge=0)


class Producto(ProductoCreate):
    codigo: int

    model_config = ConfigDict(from_attributes=True)
