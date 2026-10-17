from sqlalchemy import text
from database import engine

print("Testando conexão com PostgreSQL...")

try:
    with engine.connect() as conexao:
        resultado = conexao.execute(text("SELECT 1"))
        print("Resultado:", resultado.scalar())

    print("Conexão funcionando!")

except Exception as erro:
    print("Erro na conexão:", repr(erro))