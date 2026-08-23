from flask import Blueprint

from app.controllers.crianca_controller import CriancaController
from app.middleware.auth import token_required


crianca_bp = Blueprint(
    "criancas",
    __name__,
    url_prefix="/api/criancas"
)


crianca_bp.post("")(
    token_required(CriancaController.cadastrar)
)