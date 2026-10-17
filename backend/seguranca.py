from pwdlib import PasswordHash

pwd_context = PasswordHash.recommended()


def gerar_hash_senha(senha: str) -> str:
    return pwd_context.hash(senha)