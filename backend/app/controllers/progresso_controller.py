from flask import jsonify

from app.services.progresso_service import ProgressoService


class ProgressoController:

    @staticmethod
    def buscar_por_crianca(crianca_id):

        resposta = ProgressoService.buscar_por_crianca_id(
            crianca_id
        )

        if resposta["erro"]:
            return jsonify(resposta), 400

        return jsonify(resposta), 200