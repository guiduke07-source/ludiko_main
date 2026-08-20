from flask import Blueprint

from app.controllers.frequencia_controller import FrequenciaController
from app.middleware.auth import crianca_do_responsavel_required


frequencia_bp = Blueprint(
    "frequencia",
    __name__,
    url_prefix="/api/frequencia"
)


@frequencia_bp.route("/crianca/<crianca_id>", methods=["GET"])
@crianca_do_responsavel_required
def buscar_frequencia(crianca_id):

    return FrequenciaController.buscar_por_crianca(
        crianca_id
    )