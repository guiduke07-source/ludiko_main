from flask import Blueprint
from app.controllers.auth_controller import AuthController
from app.middleware.auth import token_required

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)

# Rotas Públicas de Login e Cadastro
auth_bp.post("/register")(AuthController.cadastrar)
auth_bp.post("/login")(AuthController.login)
auth_bp.post("/login-aluno")(AuthController.login_aluno)

# Rotas Protegidas que Exigem Autenticação
auth_bp.get("/me")(token_required(AuthController.me))
auth_bp.post("/verificar-pin")(token_required(AuthController.verificar_pin))
auth_bp.post("/alterar-senha")(token_required(AuthController.alterar_senha))
auth_bp.post("/tempo-limite")(token_required(AuthController.salvar_tempo_limite))
auth_bp.get("/tempo-limite")(token_required(AuthController.obter_tempo_limite))

# Fale Conosco Aberto (Token Opcional)
auth_bp.post("/fale-conosco")(AuthController.fale_conosco)
auth_bp.post("/cadastrar-crianca")(token_required(AuthController.cadastrar_crianca))
auth_bp.get("/minhas-criancas")(token_required(AuthController.listar_criancas))