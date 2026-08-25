from functools import wraps
from flask import jsonify
from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt_identity,
    get_jwt
)
from bson import ObjectId
from app.database.mongodb import db

def token_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except Exception:
            return jsonify({
                "erro": True,
                "mensagem": "Token inválido ou não fornecido."
            }), 401
        return func(*args, **kwargs)
    return wrapper

def role_required(*tipos_permitidos):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
                usuario_id = get_jwt_identity()
                usuario = db.usuarios.find_one({"_id": ObjectId(usuario_id)})
                if not usuario:
                    return jsonify({"erro": True, "mensagem": "Usuário não encontrado."}), 404
                
                tipo_usuario = usuario.get("tipo")
                if tipo_usuario not in tipos_permitidos:
                    return jsonify({"erro": True, "mensagem": "Você não tem permissão para acessar este recurso."}), 403
                
                return func(*args, **kwargs)
            except Exception:
                return jsonify({"erro": True, "mensagem": "Token inválido."}), 401
        return wrapper
    return decorator  # <--- CORREÇÃO: faltava retornar o decorator aqui

def crianca_do_responsavel_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            responsavel_id = get_jwt_identity()
            crianca_id = kwargs.get("crianca_id")
            responsavel = db.responsaveis.find_one({"_id": ObjectId(responsavel_id)})
            
            if not responsavel:
                return jsonify({"erro": True, "mensagem": "Responsável não encontrado."}), 404
            
            criancas_ids = [str(id_crianca) for id_crianca in responsavel.get("criancas_ids", [])]
            if crianca_id not in criancas_ids:
                return jsonify({"erro": True, "mensagem": "Você não tem permissão para acessar os dados desta criança."}), 403
            
            return func(*args, **kwargs)
        except Exception:
            return jsonify({"erro": True, "mensagem": "Token inválido ou não fornecido."}), 401
    return wrapper

def crianca_required(func):

    @wraps(func)
    def wrapper(*args, **kwargs):

        try:
            verify_jwt_in_request()

            dados_token = get_jwt()

            if dados_token.get("tipo") != "crianca":
                return jsonify({
                    "erro": True,
                    "mensagem": (
                        "Apenas crianças podem registrar "
                        "resultados de jogos."
                    )
                }), 403

            return func(*args, **kwargs)

        except Exception:
            return jsonify({
                "erro": True,
                "mensagem": "Token inválido ou não fornecido."
            }), 401

    return wrapper
