from sqlalchemy.orm import Session
from models.producto import Producto
from schemas.producto import ProductoCreate


def obtener_productos(db: Session):
    return db.query(Producto).all()


def obtener_productos_id(db: Session, codigo: int):
    return db.query(Producto).filter(Producto.codigo == codigo).first()

def crear_producto(db: Session, producto: ProductoCreate):
    nuevo_producto = Producto(
        nombre=producto.nombre,
        descripcion=producto.descripcion,
        precio=producto.precio,
        stock=producto.stock
    )
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto


def actualizar_producto(db: Session, codigo: int, producto: ProductoCreate):
    producto_db = obtener_productos_id(db, codigo)
    if not producto_db:
        return None
    
    producto_db.nombre = producto.nombre
    producto_db.descripcion = producto.descripcion
    producto_db.precio = producto.precio
    producto_db.stock = producto.stock
    
    db.commit()
    db.refresh(producto_db)
    return producto_db


def eliminar_producto(db: Session, codigo: int):
    producto_db = obtener_productos_id(db, codigo)
    if not producto_db:
        return None
    
    db.delete(producto_db)
    db.commit()
    return producto_db
