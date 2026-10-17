from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class Cliente(Base):
    __tablename__ = "clientes"
    
    id = Column(Integer, primary_key=True)
    nome = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    telefone = Column(String(20))
    cpf = Column(String(14), nullable=True, unique=True)
    cep = Column(String(9), nullable=True)
    criado_em = Column(DateTime, default=func.now(), nullable=False)
    senha_hash = Column(String(255), nullable=False)

