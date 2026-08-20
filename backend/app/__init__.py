from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from app.database.mongodb import db

from app.routes.auth_routes import auth_bp
from app.routes.aluno_routes import aluno_bp


def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app)

    jwt = JWTManager(app)

    @app.route("/api/status")
    def status():

        try:
            db.command("ping")

            return {
                "status": "online",
                "banco": "MongoDB conectado",
                "api": "Ludiko API",
                "versao": "1.0.0"
            }, 200

        except Exception as erro:

            return {
                "status": "erro",
                "mensagem": str(erro)
            }, 500

    app.register_blueprint(auth_bp)
    app.register_blueprint(aluno_bp)

    return app