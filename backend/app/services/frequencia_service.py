from app.database.mongodb import db
from bson import ObjectId
from bson.errors import InvalidId


class FrequenciaService:

    @staticmethod
    def buscar_por_crianca_id(crianca_id):

        try:
            object_id = ObjectId(crianca_id)

        except InvalidId:
            return {
                "erro": True,
                "mensagem": "ID da criança inválido."
            }

        registros = db.registro_uso.find({
            "crianca_id": object_id
        }).sort("data", 1)

        lista = []

        for registro in registros:

            atividades = []

            for atividade in registro.get("atividades_acessadas", []):
                atividades.append({
                    "titulo": atividade.get("titulo"),
                    "vezes_acessada": atividade.get("vezes_acessada", 0),
                    "emoji": atividade.get("emoji")
                })

            lista.append({
                "id": str(registro["_id"]),
                "crianca_id": str(registro["crianca_id"]),
                "data": registro.get("data"),
                "dia_semana": registro.get("dia_semana"),
                "minutos_uso": registro.get("minutos_uso", 0),
                "cor": registro.get("cor"),
                "acertos_no_dia": registro.get("acertos_no_dia", 0),
                "atividades_acessadas": atividades
            })

        return {
            "erro": False,
            "frequencia": lista
        }