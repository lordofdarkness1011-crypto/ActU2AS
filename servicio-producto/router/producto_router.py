from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from config.database import obtener_db
from schemas.producto import ProductoCreate, ProductoUpdate, Producto as ProductoResponse
from controllers import producto_controller

router = APIRouter(
    prefix="/productos",
    tags=["productos"]
)

@router.get("",response_model=list[ProductoResponse])
def listar_productos(db:Session = Depends(obtener_db)):
    return producto_controller.obtener_productos(db)

@router.get("/{codigo}",response_model=ProductoResponse)
def buscar_productos(codigo: int, db:Session = Depends(obtener_db)):
    producto = producto_controller.obtener_productos_id(db,codigo)
    if not producto:
        raise HTTPException(404, "Producto no encontrado")
    return producto

@router.post("", response_model=ProductoResponse)
def registrar_producto(producto: ProductoCreate, db: Session = Depends(obtener_db)):
    return producto_controller.crear_producto(db, producto)
    
@router.put("/{codigo}", response_model=ProductoResponse)
def actualizar_producto(codigo: int, producto: ProductoCreate, db: Session = Depends(obtener_db)):
    producto_actualizado = producto_controller.actualizar_producto(db, codigo, producto)
    if not producto_actualizado:
        raise HTTPException(404,"Producto no encontrado")
    return producto_actualizado

@router.patch("/{codigo}", response_model=ProductoResponse)
def actualizar_producto_parcial(codigo: int, producto: ProductoUpdate, db: Session = Depends(obtener_db)):
    producto_actualizado = producto_controller.actualizar_producto(db, codigo, producto)
    if not producto_actualizado:
        raise HTTPException(404,"Producto no encontrado")
    return producto_actualizado

@router.delete("/{codigo}")
def borrar_producto(codigo: int, db: Session = Depends(obtener_db)):
    producto_eliminado = producto_controller.eliminar_producto(db, codigo)
    if not producto_eliminado:
        raise HTTPException(404,"Producto no encontrado")
    return producto_eliminado