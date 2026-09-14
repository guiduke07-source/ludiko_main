from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from app.database.mongodb import db

from app.routes.auth_routes import auth_bp
from app.routes.aluno_routes import aluno_bp
from app.routes.dashboard_routes import dashboard_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # FORÇANDO AS CHAVES DIRETAMENTE NO APP.CONFIG (Garante que nunca sejam None)
    app.config["JWT_SECRET_KEY"] = "super-chave-secreta-jwt-ludiko-2026-xyz"
    app.config["SECRET_KEY"] = "super-chave-secreta-flask-ludiko-2026-xyz"

    origens_permitidas = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    CORS(
        app,
        resources={r"/*": {"origins": origens_permitidas}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # O JWTManager DEVE vir logo após as chaves estarem garantidas
    jwt = JWTManager(app)

    @jwt.unauthorized_loader
    def unauthorized_callback(mensagem):
        return jsonify({"status": "erro", "mensagem": "Acesso não autorizado ou token ausente"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(mensagem):
        return jsonify({"status": "erro", "mensagem": "Token inválido"}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"status": "erro", "mensagem": "Sessão expirada. Faça login novamente"}), 401

    @app.route("/api/status")
    def status():
        try:
            db.command("ping")
            return {
                "status": "online",
                "banco": "MongoDB conectado",
                "api": "Ludiko API",
                "versao": "1.0.0",
            }, 200
        except Exception as erro:
            return {"status": "erro", "mensagem": str(erro)}, 500

    app.register_blueprint(auth_bp)
    app.register_blueprint(aluno_bp)
    app.register_blueprint(dashboard_bp)

    return app