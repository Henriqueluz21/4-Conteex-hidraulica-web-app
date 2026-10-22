from fastapi import FastAPI
from sqlalchemy import text
from pydantic import BaseModel
from database import engine
from schemas import ClienteEntrada
from schemas import LoginEntrada
from database import SessionLocal
from models import Cliente
from seguranca import gerar_hash_senha
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from seguranca import verificar_senha

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

    except IntegrityError as erro:
        print("ERRO NO CADASTRO:", repr(erro))
        db.rollback()
        raise HTTPException(status_code=409, detail="Email já cadastrado")

    except Exception as erro:
        print("ERRO NO CADASTRO:", repr(erro))
        db.rollback()
        raise

    finally:
        db.close()
        print("SESSÃO ENCERRADA")



@app.post("/clientes/login")
def login_cliente(login: LoginEntrada):
    db = SessionLocal()

    try:
        cliente = db.query(Cliente).filter(Cliente.email == login.email).first()
          
        if cliente is not None:
            verificar = verificar_senha(login.senha, cliente.senha_hash)
            if verificar:
                return {
                    "id": cliente.id,
                    "nome": cliente.nome,
                    "email": cliente.email,
                    "telefone": cliente.telefone
                }
            else:
                        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
        
        else:
            raise HTTPException(status_code=401, detail="Email ou Senha incorretos")
        
    except HTTPException:
        raise
        
    except Exception as erro:
        print("ERRO AO CONSULTAR CLIENTE:", repr(erro))
        raise HTTPException(status_code=500, detail="Erro ao consultar cliente")
    
    finally:
        db.close()


@app.get("/testar-banco")
def testar_banco():
    with engine.connect() as conexao:
        resultado = conexao.execute(text("SELECT 1"))
        resultado.fetchone()

    return {"mensagem": "Conexão com PostgreSQL realizada com sucesso!"}
