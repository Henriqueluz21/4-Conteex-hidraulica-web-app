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
from auth import create_access_token, verify_access_token
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Conteex Hidráulica API")

bearer_scheme = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://hidraulicasaogabriel.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/clientes", status_code=201)
def criar_cliente(cliente: ClienteEntrada):

    db = SessionLocal()

    try:
        hash_senha = gerar_hash_senha(cliente.senha)
        novo_cliente = Cliente(
            nome=cliente.nome,
            email=cliente.email,
            telefone=cliente.telefone,
            senha_hash=hash_senha,
            cep=cliente.cep,
            cpf=cliente.cpf
        )

        db.add(novo_cliente)

        db.commit()

        db.refresh(novo_cliente)

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



@app.post("/clientes/login")
def login_cliente(login: LoginEntrada):
    db = SessionLocal()

    try:
        cliente = db.query(Cliente).filter(Cliente.email == login.email).first()
          
        if cliente is not None:
            verificar = verificar_senha(login.senha, cliente.senha_hash)           
            if verificar:
                token = create_access_token({"sub": str(cliente.id)})
                return {
                    "access_token": token,
                    "token_type": "bearer"
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

def obter_credenciais(credenciais: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credenciais.credentials
    verificar = verify_access_token(token)
    if verificar is None:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")
    return verificar


def obter_id_cliente(credenciais: dict = Depends(obter_credenciais)):
    if "sub" not in credenciais:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")
    if not credenciais["sub"].isdigit():
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")
    return credenciais.get("sub")


@app.get("/clientes/me")
def obter_dados_cliente(id_cliente: str = Depends(obter_id_cliente)):
    db = SessionLocal()
    
    try:       
        id_cliente = int(id_cliente)
        cliente = db.query(Cliente).filter(Cliente.id == id_cliente).first()
        if cliente is None:
            raise HTTPException(status_code=404, detail="Cliente não encontrado")
        
        return {
            "id": cliente.id,
            "nome": cliente.nome,
            "email": cliente.email,
            "telefone": cliente.telefone,
            "cpf": cliente.cpf,
            "cep": cliente.cep,
            "criado_em": cliente.criado_em
        }
    
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
