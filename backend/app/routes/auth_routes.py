from flask import Blueprint

from app.controllers.auth_controller import AuthController

from app.middleware.auth import token_required


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


auth_bp.post(
    "/register"
)(AuthController.cadastrar)


auth_bp.post(
    "/login"
)(AuthController.login)


auth_bp.get(
    "/me"
)(token_required(AuthController.me))

auth_bp.post(
    "/verificar-pin"
)(token_required(AuthController.verificar_pin))

auth_bp.post(
    "/login-aluno"
)(AuthController.login_aluno)