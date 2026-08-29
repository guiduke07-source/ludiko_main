from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request, get_jwt
from app.services.auth_service import AuthService


class AuthController:

    @staticmethod
    def cadastrar():
        dados = request.get_json() or {}
        resposta = AuthService.cadastrar(dados)
        if resposta["erro"]:
            return jsonify(resposta), 400
        return jsonify(resposta), 201

    @staticmethod
    def login():
        dados = request.get_json() or {}
        resposta = AuthService.login(dados)
        if resposta["erro"]:
            return jsonify(resposta), 401
        return jsonify(resposta), 200

    @staticmethod
    def login_aluno():
        dados = request.get_json() or {}
        resposta = AuthService.login_aluno(dados)
        if resposta["erro"]:
            return jsonify(resposta), 401
        return jsonify(resposta), 200

    @staticmethod
    def verificar_pin():
        usuario_id = get_jwt_identity()
        claims = get_jwt()
        dados = request.get_json() or {}

        resposta = AuthService.verificar_pin(
            usuario_id,
            dados,
            tipo_usuario=claims.get("tipo")
        )

        if resposta["erro"]:
            return jsonify(resposta), 401

        return jsonify(resposta), 200

    @staticmethod
    def me():
        usuario_id = get_jwt_identity()
        resposta = AuthService.obter_usuario(usuario_id)
        if resposta["erro"]:
            return jsonify(resposta), 404
        return jsonify(resposta), 200

    @staticmethod
    def alterar_senha():
        usuario_id = get_jwt_identity()
        dados = request.get_json() or {}
        resposta = AuthService.alterar_senha(usuario_id, dados)
        if resposta["erro"]:
            return jsonify(resposta), 400
        return jsonify(resposta), 200

    @staticmethod
    def salvar_tempo_limite():
        usuario_id = get_jwt_identity()
        dados = request.get_json() or {}
        resposta = AuthService.salvar_tempo_limite(usuario_id, dados)
        if resposta["erro"]:
            return jsonify(resposta), 400
        return jsonify(resposta), 200

    @staticmethod
    def obter_tempo_limite():
        usuario_id = get_jwt_identity()
        resposta = AuthService.obter_tempo_limite(usuario_id)
        if resposta["erro"]:
            return jsonify(resposta), 400
        return jsonify(resposta), 200

    @staticmethod
    def fale_conosco():
        usuario_id = None
        # Verifica o token de forma opcional sem quebrar a requisição se ele não existir
        try:
            verify_jwt_in_request(optional=True)
            usuario_id = get_jwt_identity()
        except Exception:
            usuario_id = None

        dados = request.get_json() or {}
        resposta = AuthService.salvar_fale_conosco(usuario_id, dados)

        if resposta.get("erro"):
            return jsonify(resposta), 400

        return jsonify(resposta), 200

    @staticmethod
    def cadastrar_crianca():
        usuario_id = get_jwt_identity()
        dados = request.get_json() or {}
        resposta = AuthService.cadastrar_crianca(usuario_id, dados)
        if resposta["erro"]:
            return jsonify(resposta), 400
        return jsonify(resposta), 201

    @staticmethod
    def listar_criancas():
        usuario_id = get_jwt_identity()
        resposta = AuthService.listar_criancas_vinculadas(usuario_id)
        if resposta["erro"]:
            return jsonify(resposta), 400
        return jsonify(resposta), 200