from app.database.mongodb import db
from app.models.usuario import Usuario
from app.utils.hash import gerar_hash, verificar_senha

from flask_jwt_extended import create_access_token


class AuthService:

    @staticmethod
    def verificar_pin(responsavel_id, dados):

        pin = dados.get("pin", "")

        if not pin.isdigit() or len(pin) != 4:
            return {
                "erro": True,
                "mensagem": "O PIN deve ter 4 números."
            }

        from bson import ObjectId
        from bson.errors import InvalidId

        try:
            object_id = ObjectId(responsavel_id)
        except InvalidId:
            return {
                "erro": True,
                "mensagem": "Responsável não encontrado."
            }

        responsavel = db.responsaveis.find_one({
            "_id": object_id
        })

        if not responsavel:
            return {
                "erro": True,
                "mensagem": "Responsável não encontrado."
            }

        configuracoes = responsavel.get("configuracoes", {})
        pin_hash = configuracoes.get("pin_hash")

        if not pin_hash:
            return {
                "erro": True,
                "mensagem": "PIN não configurado."
            }

        if not verificar_senha(pin, pin_hash):
            return {
                "erro": True,
                "mensagem": "PIN inválido."
            }

        return {
            "erro": False,
            "mensagem": "PIN validado com sucesso."
        }

    @staticmethod
    def cadastrar(dados):

        nome = dados.get("nome")
        email = dados.get("email")
        senha = dados.get("senha")
        tipo = dados.get("tipo")

        if not nome or not email or not senha or not tipo:
            return {
                "erro": True,
                "mensagem": "Todos os campos são obrigatórios."
            }

        email = email.lower()

        usuario = db.usuarios.find_one({
            "email": email
        })

        if usuario:
            return {
                "erro": True,
                "mensagem": "Este e-mail já está cadastrado."
            }

        senha_hash = gerar_hash(senha)

        novo_usuario = Usuario.criar(
            nome=nome,
            email=email,
            senha=senha_hash,
            tipo=tipo
        )

        resultado = db.usuarios.insert_one(novo_usuario)

        return {
            "erro": False,
            "mensagem": "Usuário cadastrado com sucesso.",
            "id": str(resultado.inserted_id)
        }

    @staticmethod
    def login(dados):

        email = dados.get("email")
        senha = dados.get("senha")

        if not email or not senha:
            return {
                "erro": True,
                "mensagem": "E-mail e senha são obrigatórios."
            }

        email = email.lower()

        responsavel = db.responsaveis.find_one({
            "email": email
        })

        if not responsavel:
            return {
                "erro": True,
                "mensagem": "E-mail ou senha inválidos."
            }

        senha_hash = responsavel.get("senha_hash")

        if not senha_hash or not verificar_senha(senha, senha_hash):
            return {
                "erro": True,
                "mensagem": "E-mail ou senha inválidos."
            }

        token = create_access_token(
            identity=str(responsavel["_id"])
        )

        return {
            "erro": False,
            "mensagem": "Login realizado com sucesso.",
            "token": token,
            "usuario": {
                "id": str(responsavel["_id"]),
                "nome": responsavel.get("nome"),
                "email": responsavel.get("email"),
                "tipo": "responsavel",
                "criancas_ids": [
                    str(crianca_id)
                    for crianca_id in responsavel.get(
                        "criancas_ids",
                        []
                    )
                ]
            }
        }

    @staticmethod
    def obter_usuario(usuario_id):

        from bson import ObjectId
        from bson.errors import InvalidId

        try:
            object_id = ObjectId(usuario_id)
        except InvalidId:
            return {
                "erro": True,
                "mensagem": "Usuário não encontrado."
            }

        responsavel = db.responsaveis.find_one({
            "_id": object_id
        })

        if not responsavel:
            return {
                "erro": True,
                "mensagem": "Usuário não encontrado."
            }

        return {
            "erro": False,
            "usuario": {
                "id": str(responsavel["_id"]),
                "nome": responsavel.get("nome"),
                "email": responsavel.get("email"),
                "tipo": "responsavel",
                "criancas_ids": [
                    str(crianca_id)
                    for crianca_id in responsavel.get(
                        "criancas_ids",
                        []
                    )
                ]
            }
        }