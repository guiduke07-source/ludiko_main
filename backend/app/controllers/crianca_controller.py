from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity

from app.services.crianca_service import CriancaService


class CriancaController:

    @staticmethod
    def cadastrar():

        responsavel_id = get_jwt_identity()
        dados = request.get_json() or {}

        resposta = CriancaService.cadastrar(
            responsavel_id,
            dados
        )

        if resposta["erro"]:
            return jsonify(resposta), 400

        return jsonify(resposta), 201