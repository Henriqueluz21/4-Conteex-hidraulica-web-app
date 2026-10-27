from pydantic import BaseModel, Field

class ClienteEntrada(BaseModel):
    nome: str
    email: str
    telefone: str
    cep: str
    cpf: str
    senha: str = Field(min_length=8)


class LoginEntrada(BaseModel):
    email: str
    senha: str = Field(min_length=8)