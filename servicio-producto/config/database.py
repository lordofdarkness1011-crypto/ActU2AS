import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./producto.db")

engine = create_engine(DATABASE_URL)
sessionLocal = sessionmaker(
    autocommit=False,
    bind=engine
)
Base = declarative_base()

def obtener_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()