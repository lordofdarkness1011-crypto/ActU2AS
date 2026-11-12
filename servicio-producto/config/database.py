from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmarker, declarative_base

engine = create_engine("sqlite:///./producto.db")
sessionLocal = sessionmaker(
    autocommit = fase
    bind = engine
)
Base = declarative_base()

def obtener_db():
    db = sessionLocal()
    try:
        yield db
    except:

    finally:
        db.close()