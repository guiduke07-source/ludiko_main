from datetime import datetime, timezone, timedelta
from bson import ObjectId
from bson.errors import InvalidId
from flask_jwt_extended import create_access_token
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import random

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
    def solicitar_codigo_recuperacao(dados):
        email = dados.get("email", "").strip().lower()
        if not email:
            return {"erro": True, "mensagem": "Informe o seu e-mail cadastrado."}

        usuario = db.responsaveis.find_one({"email": email})
        if not usuario:
            return {"erro": True, "mensagem": "Nenhuma conta de responsável encontrada com este e-mail."}

        codigo = f"{random.randint(100000, 999999)}"

        db.responsaveis.update_one(
            {"_id": usuario["_id"]},
            {"$set": {
                "codigo_recuperacao": codigo,
                "codigo_expira_em": datetime.now(timezone.utc) + timedelta(minutes=15)
            }}
        )

        EMAIL_REMETENTE = os.getenv("EMAIL_REMETENTE", "gsantosmaria07@gmail.com")
        SENHA_APP = os.getenv("EMAIL_SENHA_APP", "dtjgcplrvdojidnq")

        try:
            corpo_email = f"""
Olá, {usuario.get('nome', 'Responsável')}!

Recebemos uma solicitação para redefinir a senha da sua conta no Ludiko.

Seu código de confirmação de 6 dígitos é:
------------------------
{codigo}
------------------------

Este código expira em 15 minutos. Caso você não tenha solicitado esta alteração, desconsidere este e-mail.
"""
            msg = MIMEMultipart()
            msg["From"] = EMAIL_REMETENTE
            msg["To"] = email
            msg["Subject"] = f"[Ludiko] Código de Confirmação: {codigo}"
            msg.attach(MIMEText(corpo_email, "plain", "utf-8"))

            with smtplib.SMTP("smtp.gmail.com", 587) as servidor:
                servidor.starttls()
                servidor.login(EMAIL_REMETENTE, SENHA_APP)
                servidor.send_message(msg)

        except Exception as e:
            print(f"Erro ao enviar código SMTP: {str(e)}")
            return {"erro": True, "mensagem": "Erro ao despachar o e-mail de recuperação."}

        return {"erro": False, "mensagem": "Código enviado! Verifique seu e-mail."}

    @staticmethod
    def redefinir_senha_com_codigo(dados):
        email = dados.get("email", "").strip().lower()
        codigo = str(dados.get("codigo", "")).strip()
        nova_senha = dados.get("nova_senha", "")

        if not email or not codigo or not nova_senha:
            return {"erro": True, "mensagem": "Preencha o e-mail, código e a nova senha."}

        if len(nova_senha) < 6:
            return {"erro": True, "mensagem": "A nova senha deve ter no mínimo 6 caracteres."}

        usuario = db.responsaveis.find_one({"email": email})
        if not usuario:
            return {"erro": True, "mensagem": "Usuário não encontrado."}

        codigo_salvo = usuario.get("codigo_recuperacao")
        expira_em = usuario.get("codigo_expira_em")

        if not codigo_salvo or str(codigo_salvo) != codigo:
            return {"erro": True, "mensagem": "Código de confirmação incorreto."}

        if expira_em:
            if expira_em.tzinfo is None:
                expira_em = expira_em.replace(tzinfo=timezone.utc)
            if datetime.now(timezone.utc) > expira_em:
                return {"erro": True, "mensagem": "Este código expirou. Solicite um novo."}

        novo_hash = gerar_hash(nova_senha)
        db.responsaveis.update_one(
            {"_id": usuario["_id"]},
            {
                "$set": {"senha_hash": novo_hash, "updatedAt": datetime.now(timezone.utc)},
                "$unset": {"codigo_recuperacao": "", "codigo_expira_em": ""}
            }
        )

        return {"erro": False, "mensagem": "Senha redefinida com sucesso! Faça login com a nova senha."}

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
        email_informado = dados.get("email", "").strip()
        nome_informado = dados.get("nome", "").strip()

        if not mensagem or not assunto:
            return {"erro": True, "mensagem": "Assunto e mensagem são obrigatórios."}

        obj_id = None
        nome_usuario = nome_informado or "Usuário Não Identificado"
        email_usuario = email_informado

        if responsavel_id:
            try:
                obj_id = ObjectId(responsavel_id)
                responsavel = db.responsaveis.find_one({"_id": obj_id})
                if responsavel:
                    nome_usuario = responsavel.get("nome") or nome_usuario
                    email_usuario = responsavel.get("email") or email_usuario
            except InvalidId:
                pass

        db.mensagens_suporte.insert_one({
            "responsavel_id": obj_id,
            "nome_usuario": nome_usuario,
            "email_contato": email_usuario,
            "assunto": assunto,
            "mensagem": mensagem,
            "criado_em": datetime.now(timezone.utc)
        })

        EMAIL_DESTINO = os.getenv("EMAIL_SUPORTE", "gsantosmaria07@gmail.com")
        EMAIL_REMETENTE = os.getenv("EMAIL_REMETENTE", "gsantosmaria07@gmail.com")
        SENHA_APP = os.getenv("EMAIL_SENHA_APP", "dtjgcplrvdojidnq")

        try:
            corpo_email = f"""
Nova mensagem recebida pelo Fale Conosco do Ludiko:

- Nome do Usuário: {nome_usuario}
- E-mail do Usuário: {email_usuario}
- Assunto: {assunto}

Mensagem:
--------------------------------------------------
{mensagem}
--------------------------------------------------
"""
            msg = MIMEMultipart()
            msg["From"] = EMAIL_REMETENTE
            msg["To"] = EMAIL_DESTINO
            msg["Subject"] = f"[Ludiko Suporte] {assunto} - Enviado por {nome_usuario}"
            msg.attach(MIMEText(corpo_email, "plain", "utf-8"))

            with smtplib.SMTP("smtp.gmail.com", 587) as servidor:
                servidor.starttls()
                servidor.login(EMAIL_REMETENTE, SENHA_APP)
                servidor.send_message(msg)

        except Exception as e:
            print(f"Aviso: Mensagem gravada no banco, mas erro ao despachar SMTP: {str(e)}")

        return {"erro": False, "mensagem": "Mensagem enviada com sucesso! Entraremos em contato."}

    @staticmethod
    def cadastrar_crianca(responsavel_id, dados):
        nome = dados.get("nome", "").strip()
        cpf = "".join(filter(str.isdigit, dados.get("cpf", "")))
        senha = dados.get("senha", "")
        ano_escolar = dados.get("ano_escolar", "1ano")

        if not nome or not cpf or not senha:
            return {"erro": True, "mensagem": "Nome, CPF e senha da criança são obrigatórios."}

        if db.criancas.find_one({"cpf": cpf}):
            return {"erro": True, "mensagem": "Já existe uma criança cadastrada com este CPF."}

        try:
            resp_oid = ObjectId(responsavel_id)
        except Exception:
            return {"erro": True, "mensagem": "ID de responsável inválido."}

        nova_crianca = {
            "nome": nome,
            "cpf": cpf,
            "senha_hash": gerar_hash(senha),
            "ano_escolar": ano_escolar,
            "responsavel_id": resp_oid,
            "createdAt": datetime.now(timezone.utc),
            "updatedAt": datetime.now(timezone.utc)
        }

        res = db.criancas.insert_one(nova_crianca)
        crianca_id = res.inserted_id

        db.responsaveis.update_one(
            {"_id": resp_oid},
            {"$addToSet": {"criancas_ids": crianca_id}}
        )

        return {
            "erro": False,
            "mensagem": "Criança cadastrada com sucesso!",
            "crianca": {
                "id": str(crianca_id),
                "nome": nome,
                "cpf": cpf
            }
        }

    @staticmethod
    def listar_criancas_vinculadas(responsavel_id):
        try:
            resp_oid = ObjectId(responsavel_id)
        except Exception:
            return {"erro": True, "mensagem": "ID de responsável inválido."}

        criancas = list(db.criancas.find({
            "$or": [
                {"responsavel_id": resp_oid},
                {"responsavel_id": str(resp_oid)}
            ]
        }))

        lista = []
        for c in criancas:
            lista.append({
                "id": str(c["_id"]),
                "nome": c.get("nome"),
                "cpf": c.get("cpf"),
                "ano_escolar": c.get("ano_escolar", "1ano")
            })

        return {"erro": False, "criancas": lista}