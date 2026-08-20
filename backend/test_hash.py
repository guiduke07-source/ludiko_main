from app.utils.hash import gerar_hash, verificar_senha

senha = "123456"

senha_hash = gerar_hash(senha)

print("Hash:", senha_hash)
print("Senha correta:", verificar_senha("123456", senha_hash))
print("Senha incorreta:", verificar_senha("abcdef", senha_hash))