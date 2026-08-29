from datetime import datetime, timezone, timedelta
from bson import ObjectId
from bson.errors import InvalidId
from flask_jwt_extended import create_access_token

from app.database.mongodb import db
from app.utils.hash import gerar_hash, verificar_senha


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

        # Token com validade longa (30 dias)
        token = create_access_token(
            identity=responsavel_id,
            additional_claims={"tipo": "responsavel"},
            expires_delta=timedelta(days=30)
        )

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

        # Token com validade longa (30 dias)
        token = create_access_token(
            identity=str(responsavel["_id"]),
            additional_claims={"tipo": "responsavel"},
            expires_delta=timedelta(days=30)
        )

        criancas_ids = [str(c_id) for c_id in responsavel.get("criancas_ids", [])]
        if not criancas_ids:
            criancas_banco = db.criancas.find({
                "$or": [
                    {"responsavel_id": responsavel["_id"]},
                    {"responsavel_id": str(responsavel["_id"])}
                ]
            })
            criancas_ids = [str(c["_id"]) for c in criancas_banco]

        return {
            "erro": False,
            "mensagem": "Login realizado com sucesso.",
            "token": token,
            "usuario": {
                "id": str(responsavel["_id"]),
                "nome": responsavel.get("nome"),
                "email": responsavel.get("email"),
                "tipo": "responsavel",
                "criancas_ids": criancas_ids
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

        # Token com validade longa (30 dias)
        token = create_access_token(
            identity=str(crianca["_id"]),
            additional_claims={"tipo": "crianca"},
            expires_delta=timedelta(days=30)
        )

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
    def verificar_pin(usuario_id, dados, tipo_usuario=None):
        pin = str(dados.get("pin", "")).strip()

        if not pin.isdigit() or len(pin) != 4:
            return {"erro": True, "mensagem": "O PIN deve ter 4 números."}

        try:
            object_id = ObjectId(usuario_id)
        except InvalidId:
            return {"erro": True, "mensagem": "ID de usuário inválido."}

        responsavel = None
        crianca_encontrada_id = None

        if tipo_usuario == "crianca":
            crianca = db.criancas.find_one({"_id": object_id})
            if not crianca:
                return {"erro": True, "mensagem": "Criança não encontrada."}

            crianca_encontrada_id = str(crianca["_id"])
            responsavel_id = crianca.get("responsavel_id") or crianca.get("id_responsavel")

            if responsavel_id:
                try:
                    responsavel = db.responsaveis.find_one({"_id": ObjectId(responsavel_id)})
                except InvalidId:
                    responsavel = None

            if not responsavel:
                responsavel = db.responsaveis.find_one({
                    "$or": [
                        {"criancas_ids": object_id},
                        {"criancas_ids": str(object_id)}
                    ]
                })
        else:
            responsavel = db.responsaveis.find_one({"_id": object_id})

        if not responsavel:
            return {"erro": True, "mensagem": "Responsável vinculado não encontrado."}

        configuracoes = responsavel.get("configuracoes", {})
        pin_hash = configuracoes.get("pin_hash")

        if not pin_hash:
            return {"erro": True, "mensagem": "PIN não configurado."}

        if not verificar_senha(pin, pin_hash):
            return {"erro": True, "mensagem": "PIN inválido."}

        responsavel_id_str = str(responsavel["_id"])
        token_responsavel = create_access_token(
            identity=responsavel_id_str,
            additional_claims={"tipo": "responsavel"},
            expires_delta=timedelta(days=30)
        )

        criancas_ids = [str(c_id) for c_id in responsavel.get("criancas_ids", [])]
        if crianca_encontrada_id and crianca_encontrada_id not in criancas_ids:
            criancas_ids.append(crianca_encontrada_id)

        return {
            "erro": False,
            "mensagem": "PIN validado com sucesso.",
            "token": token_responsavel,
            "usuario": {
                "id": responsavel_id_str,
                "nome": responsavel.get("nome"),
                "email": responsavel.get("email"),
                "tipo": "responsavel",
                "criancas_ids": criancas_ids
            }
        }

    @staticmethod
    def obter_usuario(usuario_id):
        try:
            object_id = ObjectId(usuario_id)
        except InvalidId:
            return {"erro": True, "mensagem": "Usuário não encontrado."}

        responsavel = db.responsaveis.find_one({"_id": object_id})

        if not responsavel:
            return {"erro": True, "mensagem": "Usuário não encontrado."}

        criancas_ids = [str(c_id) for c_id in responsavel.get("criancas_ids", [])]
        if not criancas_ids:
            criancas_banco = db.criancas.find({
                "$or": [
                    {"responsavel_id": responsavel["_id"]},
                    {"responsavel_id": str(responsavel["_id"])}
                ]
            })
            criancas_ids = [str(c["_id"]) for c in criancas_banco]

        return {
            "erro": False,
            "usuario": {
                "id": str(responsavel["_id"]),
                "nome": responsavel.get("nome"),
                "email": responsavel.get("email"),
                "tipo": "responsavel",
                "criancas_ids": criancas_ids
            }
        }

    @staticmethod
    def alterar_senha(responsavel_id, dados):
        senha_atual = dados.get("senha_atual", "")
        senha_nova = dados.get("senha_nova", "")

        if not senha_atual or not senha_nova:
            return {"erro": True, "mensagem": "Preencha a senha atual e a nova senha."}

        if len(senha_nova) < 6:
            return {"erro": True, "mensagem": "A nova senha deve ter no mínimo 6 caracteres."}

        try:
            object_id = ObjectId(responsavel_id)
        except InvalidId:
            return {"erro": True, "mensagem": "Usuário não encontrado."}

        responsavel = db.responsaveis.find_one({"_id": object_id})
        if not responsavel:
            return {"erro": True, "mensagem": "Responsável não encontrado."}

        senha_hash_atual = responsavel.get("senha_hash")
        if not senha_hash_atual or not verificar_senha(senha_atual, senha_hash_atual):
            return {"erro": True, "mensagem": "A senha atual está incorreta."}

        novo_hash = gerar_hash(senha_nova)
        db.responsaveis.update_one(
            {"_id": object_id},
            {"$set": {"senha_hash": novo_hash, "updatedAt": datetime.now(timezone.utc)}}
        )

        return {"erro": False, "mensagem": "Senha alterada com sucesso!"}

    @staticmethod
    def salvar_tempo_limite(responsavel_id, dados):
        minutos = dados.get("minutos")
        if minutos is None or not isinstance(minutos, int) or minutos < 0:
            return {"erro": True, "mensagem": "Selecione um tempo limite válido."}

        try:
            object_id = ObjectId(responsavel_id)
        except InvalidId:
            return {"erro": True, "mensagem": "Usuário não encontrado."}

        db.responsaveis.update_one(
            {"_id": object_id},
            {"$set": {
                "configuracoes.limite_tempo_minutos": minutos,
                "updatedAt": datetime.now(timezone.utc)
            }}
        )

        return {"erro": False, "mensagem": "Tempo limite atualizado com sucesso!"}

    @staticmethod
    def obter_tempo_limite(responsavel_id):
        try:
            object_id = ObjectId(responsavel_id)
        except InvalidId:
            return {"erro": True, "mensagem": "Usuário não encontrado."}

        responsavel = db.responsaveis.find_one({"_id": object_id})
        if not responsavel:
            return {"erro": True, "mensagem": "Responsável não encontrado."}

        config = responsavel.get("configuracoes", {})
        minutos = config.get("limite_tempo_minutos", 120)

        return {"erro": False, "minutos": minutos}

    @staticmethod
    def salvar_fale_conosco(responsavel_id, dados):
        mensagem = dados.get("mensagem", "").strip()
        assunto = dados.get("assunto", "").strip()
        email_contato = dados.get("email", "").strip()

        if not mensagem or not assunto:
            return {"erro": True, "mensagem": "Assunto e mensagem são obrigatórios."}

        obj_id = None
        if responsavel_id:
            try:
                obj_id = ObjectId(responsavel_id)
            except InvalidId:
                pass

        db.mensagens_suporte.insert_one({
            "responsavel_id": obj_id,
            "email_contato": email_contato,
            "assunto": assunto,
            "mensagem": mensagem,
            "criado_em": datetime.now(timezone.utc)
        })

        return {"erro": False, "mensagem": "Mensagem enviada com sucesso! Entraremos em contato."}