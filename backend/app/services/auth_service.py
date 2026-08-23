from datetime import datetime, timezone
from app.database.mongodb import db
from app.utils.hash import gerar_hash, verificar_senha
from flask_jwt_extended import create_access_token
from bson import ObjectId
from bson.errors import InvalidId

class AuthService:
    @staticmethod
    def cadastrar(dados):
        nome = dados.get("nome", "").strip()
        email = dados.get("email", "").strip().lower()
        cpf = "".join(filter(str.isdigit, dados.get("cpf", "")))
        senha = dados.get("senha", "")
        pin = str(dados.get("pin", ""))

        if not nome or not email or not cpf or not senha or not pin:
            return {"erro": True, "mensagem": "Todos os campos são obrigatórios."}

        if not pin.isdigit() or len(pin) != 4:
            return {"erro": True, "mensagem": "O PIN deve ter 4 números."}

        responsavel_existente = db.responsaveis.find_one({
            "$or": [{"email": email}, {"cpf": cpf}]
        })

        if responsavel_existente:
            return {"erro": True, "mensagem": "Já existe um responsável com este e-mail ou CPF."}

        novo_responsavel = {
            "nome": nome,
            "email": email,
            "cpf": cpf,
            "senha_hash": gerar_hash(senha),
            "criancas_ids": [],
            "configuracoes": {
                "limite_tempo_minutos": 120,
                "jogos_bloqueados": [],
                "notificacoes": True,
                "pin_hash": gerar_hash(pin)
            },
            "createdAt": datetime.now(timezone.utc),
            "updatedAt": datetime.now(timezone.utc),
            "__v": 0
        }

        resultado = db.responsaveis.insert_one(novo_responsavel)
        responsavel_id = str(resultado.inserted_id)
        
        # Segurança: Adicionado "tipo" nas claims do cadastro
        token = create_access_token(identity=responsavel_id, additional_claims={"tipo": "responsavel"})

        return {
            "erro": False,
            "mensagem": "Responsável cadastrado com sucesso.",
            "token": token,
            "usuario": {
                "id": responsavel_id,
                "nome": nome,
                "email": email,
                "tipo": "responsavel",
                "criancas_ids": []
            }
        }

    @staticmethod
    def login(dados):
        email = dados.get("email", "").strip().lower()
        senha = dados.get("senha", "")

        if not email or not senha:
            return {"erro": True, "mensagem": "E-mail e senha são obrigatórios."}

        responsavel = db.responsaveis.find_one({"email": email})

        if not responsavel:
            return {"erro": True, "mensagem": "E-mail ou senha inválidos."}

        senha_hash = responsavel.get("senha_hash")
        if not senha_hash or not verificar_senha(senha, senha_hash):
            return {"erro": True, "mensagem": "E-mail ou senha inválidos."}

        # Segurança: Adicionado "tipo" nas claims do login do responsável
        token = create_access_token(identity=str(responsavel["_id"]), additional_claims={"tipo": "responsavel"})

        return {
            "erro": False,
            "mensagem": "Login realizado com sucesso.",
            "token": token,
            "usuario": {
                "id": str(responsavel["_id"]),
                "nome": responsavel.get("nome"),
                "email": responsavel.get("email"),
                "tipo": "responsavel",
                "criancas_ids": [str(c_id) for c_id in responsavel.get("criancas_ids", [])]
            }
        }

    @staticmethod
    def login_aluno(dados):
        cpf = "".join(filter(str.isdigit, dados.get("cpf", "")))
        senha = dados.get("senha", "")

        if not cpf or not senha:
            return {"erro": True, "mensagem": "CPF e senha são obrigatórios."}

        crianca = db.criancas.find_one({"cpf": cpf})

        if not crianca:
            return {"erro": True, "mensagem": "CPF ou senha inválidos."}

        senha_hash = crianca.get("senha_hash")
        if not senha_hash or not verificar_senha(senha, senha_hash):
            return {"erro": True, "mensagem": "CPF ou senha inválidos."}

        token = create_access_token(identity=str(crianca["_id"]), additional_claims={"tipo": "crianca"})

        return {
            "erro": False,
            "mensagem": "Login realizado com sucesso.",
            "token": token,
            "usuario": {
                "id": str(crianca["_id"]),
                "nome": crianca.get("nome"),
                "cpf": crianca.get("cpf"),
                "tipo": "crianca"
            }
        }

    @staticmethod
    def verificar_pin(responsavel_id, dados):
        pin = str(dados.get("pin", ""))

        if not pin.isdigit() or len(pin) != 4:
            return {"erro": True, "mensagem": "O PIN deve ter 4 números."}

        try:
            object_id = ObjectId(responsavel_id)
        except InvalidId:
            return {"erro": True, "mensagem": "Responsável não encontrado."}

        responsavel = db.responsaveis.find_one({"_id": object_id})

        if not responsavel:
            return {"erro": True, "mensagem": "Responsável não encontrado."}

        configuracoes = responsavel.get("configuracoes", {})
        pin_hash = configuracoes.get("pin_hash")

        if not pin_hash:
            return {"erro": True, "mensagem": "PIN não configurado."}

        if not verificar_senha(pin, pin_hash):
            return {"erro": True, "mensagem": "PIN inválido."}

        return {"erro": False, "mensagem": "PIN validado com sucesso."}

    @staticmethod
    def obter_usuario(usuario_id):
        try:
            object_id = ObjectId(usuario_id)
        except InvalidId:
            return {"erro": True, "mensagem": "Usuário não encontrado."}

        responsavel = db.responsaveis.find_one({"_id": object_id})

        if not responsavel:
            return {"erro": True, "mensagem": "Usuário não encontrado."}

        return {
            "erro": False,
            "usuario": {
                "id": str(responsavel["_id"]),
                "nome": responsavel.get("nome"),
                "email": responsavel.get("email"),
                "tipo": "responsavel",
                "criancas_ids": [str(c_id) for c_id in responsavel.get("criancas_ids", [])]
            }
        }
