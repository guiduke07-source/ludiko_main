from app import create_app

from app.routes.frequencia_routes import frequencia_bp
from app.routes.progresso_routes import progresso_bp
from app.routes.crianca_routes import crianca_bp
from app.routes.resultado_routes import resultado_bp

app = create_app()

app.register_blueprint(frequencia_bp)
app.register_blueprint(progresso_bp)
app.register_blueprint(crianca_bp)
app.register_blueprint(resultado_bp)

if __name__ == "__main__":
    app.run(debug=True)