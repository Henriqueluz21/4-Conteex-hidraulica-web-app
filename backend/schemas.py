from pydantic import BaseModel, Field

class ClienteEntrada(BaseModel):
    nome: str
    email: str
    telefone: str
    senha: str = Field(min_length=8)