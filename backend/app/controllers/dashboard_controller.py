from flask import request, jsonify
from app.services.dashboard_service import DashboardService

class DashboardController:

    @staticmethod
    def frequencia(crianca_id):
        ano = request.args.get("ano")
        semana = request.args.get("semana")
        resposta = DashboardService.obter_frequencia(crianca_id, ano, semana)
        if resposta.get("erro"):
            return jsonify(resposta), 400
        return jsonify(resposta), 200

    @staticmethod
    def historico(crianca_id):
        resposta = DashboardService.obter_historico_semanas(crianca_id)
        if resposta.get("erro"):
            return jsonify(resposta), 400
        return jsonify(resposta), 200

    @staticmethod
    def progresso(crianca_id):
        resposta = DashboardService.obter_progresso(crianca_id)
        if resposta.get("erro"):
            return jsonify(resposta), 400
        return jsonify(resposta), 200