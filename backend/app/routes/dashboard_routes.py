from flask import Blueprint, request, jsonify
from app.controllers.dashboard_controller import DashboardController
from app.services.dashboard_service import DashboardService
from app.middleware.auth import token_required

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api")

dashboard_bp.get("/frequencia/crianca/<crianca_id>")(
    token_required(DashboardController.frequencia)
)

dashboard_bp.get("/historico/crianca/<crianca_id>")(
    token_required(DashboardController.historico)
)

dashboard_bp.get("/progresso/crianca/<crianca_id>")(
    token_required(DashboardController.progresso)
)


@dashboard_bp.post("/partida/registrar/<crianca_id>")
def registrar_partida(crianca_id):
    dados = request.get_json() or {}
    resposta = DashboardService.registrar_partida(crianca_id, dados)

    if resposta.get("erro"):
        return jsonify(resposta), 400

    return jsonify(resposta), 200