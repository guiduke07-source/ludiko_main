from flask import request, jsonify

from flask_jwt_extended import get_jwt_identity

from app.services.auth_service import AuthService


class AuthController:

    @staticmethod
    def cadastrar():

        dados = request.get_json()

        resposta = AuthService.cadastrar(dados)

        if resposta["erro"]:
            return jsonify(resposta), 400

        return jsonify(resposta), 201

    @staticmethod
    def login():

        dados = request.get_json()

        resposta = AuthService.login(dados)

        if resposta["erro"]:
            return jsonify(resposta), 401

        return jsonify(resposta), 200

    @staticmethod
    def verificar_pin():

        responsavel_id = get_jwt_identity()
        dados = request.get_json() or {}

        resposta = AuthService.verificar_pin(
            responsavel_id,
            dados
        )

        if resposta["erro"]:
            return jsonify(resposta), 401

        return jsonify(resposta), 200

    @staticmethod
    def me():

        usuario_id = get_jwt_identity()

        resposta = AuthService.obter_usuario(
            usuario_id
        )

        if resposta["erro"]:
            return jsonify(resposta), 404

        return jsonify(resposta), 200