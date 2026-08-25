from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity

from app.services.resultado_service import ResultadoService


class ResultadoController:

    @staticmethod
    def registrar():

        crianca_id = get_jwt_identity()
        dados = request.get_json() or {}

        resposta = ResultadoService.registrar(
            crianca_id,
            dados
        )

        if resposta["erro"]:
            return jsonify(resposta), 400

        return jsonify(resposta), 201