from app.database.mongodb import db
from bson import ObjectId
from bson.errors import InvalidId


class DashboardService:

    @staticmethod
    def buscar_dashboard(crianca_id):

        try:
            object_id = ObjectId(crianca_id)

        except InvalidId:
            return {
                "erro": True,
                "mensagem": "ID da criança inválido."
            }

        # =========================
        # REGISTRO DE USO
        # =========================

        registros = db.registro_uso.find({
            "crianca_id": object_id
        }).sort("data", 1)

        tempo_diario = []
        acertos_diarios = []
        atividades = []

        for registro in registros:

            data = registro.get("data")

            data_formatada = (
                data.strftime("%Y-%m-%d")
                if data
                else None
            )

            tempo_diario.append({
                "data": data_formatada,
                "dia_semana": registro.get("dia_semana"),
                "minutos_uso": registro.get("minutos_uso", 0),
                "cor": registro.get("cor")
            })

            acertos_diarios.append({
                "data": data_formatada,
                "dia_semana": registro.get("dia_semana"),
                "acertos": registro.get("acertos_no_dia", 0)
            })

            for atividade in registro.get(
                "atividades_acessadas",
                []
            ):

                atividades.append({
                    "titulo": atividade.get("titulo"),
                    "vezes_acessada": atividade.get(
                        "vezes_acessada",
                        0
                    ),
                    "emoji": atividade.get("emoji")
                })

        # =========================
        # PROGRESSO
        # =========================

        registros_progresso = db.progresso.find({
            "crianca_id": object_id
        })

        desempenho_categorias = []

        for registro in registros_progresso:

            desempenho_categorias.append({
                "categoria_id": str(
                    registro["categoria_id"]
                ),
                "titulo_categoria": registro.get(
                    "titulo_categoria"
                ),
                "porcentagem": registro.get(
                    "porcentagem",
                    0
                ),
                "acertos": registro.get(
                    "acertos",
                    0
                ),
                "erros": registro.get(
                    "erros",
                    0
                ),
                "total_exercicios": registro.get(
                    "total_exercicios",
                    0
                ),
                "exercicios_completos": registro.get(
                    "exercicios_completos",
                    0
                ),
                "cor": registro.get("cor")
            })

        return {
            "erro": False,
            "dashboard": {
                "tempo_diario": tempo_diario,
                "acertos_diarios": acertos_diarios,
                "desempenho_categorias": desempenho_categorias,
                "atividades": atividades
            }
        }