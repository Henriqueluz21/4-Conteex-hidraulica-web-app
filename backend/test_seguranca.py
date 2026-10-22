from seguranca import gerar_hash_senha
from seguranca import verificar_senha

senha = "MinhaSenha123"
hash_senha = gerar_hash_senha(senha)

print("Senha original:", senha)
print("Hash gerado:", hash_senha)


senha_digitada =  "MinhaSenha123"
verificacao = verificar_senha(senha_digitada, hash_senha)
if verificacao:
    print("Senha correta!")
else:
    print("Senha incorreta!")