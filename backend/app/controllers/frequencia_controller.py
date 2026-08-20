from flask import jsonify

from app.services.frequencia_service import FrequenciaService

class FrequenciaController:

    @staticmethod
    def buscar_por_crianca(crianca_id):

        resposta = FrequenciaService.buscar_por_crianca_id(
            crianca_id
        )

        if resposta["erro"]:
            return jsonify(resposta), 400

        return jsonify(resposta), 200