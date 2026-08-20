from flask import Blueprint

from app.controllers.progresso_controller import ProgressoController
from app.middleware.auth import crianca_do_responsavel_required


progresso_bp = Blueprint(
    "progresso",
    __name__,
    url_prefix="/api/progresso"
)


@progresso_bp.route("/crianca/<crianca_id>", methods=["GET"])
@crianca_do_responsavel_required
def buscar_progresso(crianca_id):

    return ProgressoController.buscar_por_crianca(
        crianca_id
    )