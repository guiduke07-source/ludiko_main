from flask import Blueprint

from app.controllers.aluno_controller import AlunoController
from app.middleware.auth import token_required


aluno_bp = Blueprint(
    "alunos",
    __name__,
    url_prefix="/api/alunos"
)


aluno_bp.post("")(
    AlunoController.cadastrar
)


aluno_bp.get("")(
    AlunoController.listar
)


aluno_bp.get("/me")(
    token_required(AlunoController.me)
)


aluno_bp.get("/<aluno_id>")(
    AlunoController.buscar_por_id
)


aluno_bp.put("/<aluno_id>")(
    AlunoController.atualizar
)