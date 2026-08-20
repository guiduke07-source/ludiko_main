from app.database.mongodb import db
from bson import ObjectId
from bson.errors import InvalidId


class ProgressoService:

    @staticmethod
    def buscar_por_crianca_id(crianca_id):

        try:
            object_id = ObjectId(crianca_id)

        except InvalidId:
            return {
                "erro": True,
                "mensagem": "ID da criança inválido."
            }

        registros = db.progresso.find({
            "crianca_id": object_id
        })

        lista = []

        for registro in registros:

            lista.append({
                "id": str(registro["_id"]),
                "crianca_id": str(registro["crianca_id"]),
                "categoria_id": str(registro["categoria_id"]),
                "titulo_categoria": registro.get("titulo_categoria"),
                "porcentagem": registro.get("porcentagem", 0),
                "cor": registro.get("cor"),
                "total_exercicios": registro.get("total_exercicios", 0),
                "exercicios_completos": registro.get(
                    "exercicios_completos", 0
                ),
                "acertos": registro.get("acertos", 0),
                "erros": registro.get("erros", 0)
            })

        return {
            "erro": False,
            "progresso": lista
        }