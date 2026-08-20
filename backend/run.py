from app import create_app

from app.routes.frequencia_routes import frequencia_bp
from app.routes.progresso_routes import progresso_bp


app = create_app()

app.register_blueprint(frequencia_bp)
app.register_blueprint(progresso_bp)


if __name__ == "__main__":
    app.run(debug=True)