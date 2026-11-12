from sqlalchemy import Column, Integer, String, Text, Float
from config.database import Base

class Producto(Base):
    __tablename__ = "producto"

    codigo = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(20))
    descripcion = Column(Text)
    precio = Column(Float)
    stock = Column(Integer)
