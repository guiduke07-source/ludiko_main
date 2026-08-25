from flask import Blueprint

from app.controllers.resultado_controller import (
    ResultadoController
)
from app.middleware.auth import crianca_required


resultado_bp = Blueprint(
    "resultados",
    __name__,
    url_prefix="/api/resultados"
)


resultado_bp.post("")(
    crianca_required(ResultadoController.registrar)
)