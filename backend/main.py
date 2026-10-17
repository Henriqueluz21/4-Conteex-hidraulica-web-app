from fastapi import FastAPI
from sqlalchemy import text
from pydantic import BaseModel
from database import engine
from schemas import ClienteEntrada
from database import SessionLocal
from models import Cliente
from seguranca import gerar_hash_senha

app = FastAPI(title="Conteex Hidráulica API")



@app.post("/clientes", status_code=201)
def criar_cliente(cliente: ClienteEntrada):
    print("ETAPA 1: iniciando cadastro")

    db = SessionLocal()

    try:
        hash_senha = gerar_hash_senha(cliente.senha)
        print("ETAPA 2: hash gerado")

        novo_cliente = Cliente(
            nome=cliente.nome,
            email=cliente.email,
            telefone=cliente.telefone,
            senha_hash=hash_senha
        )
        print("ETAPA 3: objeto criado")

        db.add(novo_cliente)
        print("ETAPA 4: objeto adicionado à sessão")

        db.commit()
        print("ETAPA 5: commit concluído")

        db.refresh(novo_cliente)
        print("ETAPA 6: objeto atualizado")

        return {
            "mensagem": "Cliente cadastrado com sucesso!",
            "id": novo_cliente.id,
            "nome": novo_cliente.nome,
            "email": novo_cliente.email
        }

    except Exception as erro:
        print("ERRO NO CADASTRO:", repr(erro))
        db.rollback()
        raise

    finally:
        db.close()
        print("SESSÃO ENCERRADA")


@app.get("/")
def inicio():
    return {"mensagem": "API da Conteex funcionando!"}


@app.get("/testar-banco")
def testar_banco():
    with engine.connect() as conexao:
        resultado = conexao.execute(text("SELECT 1"))
        resultado.fetchone()

    return {"mensagem": "Conexão com PostgreSQL realizada com sucesso!"}
