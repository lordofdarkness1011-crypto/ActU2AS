from fastapi import FastAPI

from config.database import engine, Base
from router.producto_router import router as producto_router

app = FastAPI(
    title="Servicio Producto",
    description="Servicio desarrollado en Clases de Arquitectura de Software",
    version="1.0.0"
)
Base.metadata.create_all(bind=engine)

app.include_router(producto_router, prefix("/"))

@app.get("/")
def inicio():
    return {"mensaje":"Servicio factura ejecutandóse con éxito"}