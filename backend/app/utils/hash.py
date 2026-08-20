import bcrypt

from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)


def gerar_hash(senha):
    return bcrypt.hashpw(
        senha.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


def verificar_senha(senha, senha_hash):

    if senha_hash.startswith(("$2a$", "$2b$", "$2y$")):
        return bcrypt.checkpw(
            senha.encode("utf-8"),
            senha_hash.encode("utf-8")
        )

    return check_password_hash(senha_hash, senha)