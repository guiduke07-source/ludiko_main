from datetime import datetime, timedelta
from math import ceil

from bson import ObjectId
from bson.errors import InvalidId

from app.database.mongodb import db


class ResultadoService:

    @staticmethod
    def registrar(crianca_id, dados):

        atividade = dados.get("atividade", "").strip()
        categoria = dados.get("categoria", "").strip()

        try:
            acertos = int(dados.get("acertos", 0))
            erros = int(dados.get("erros", 0))
            duracao_segundos = int(
                dados.get("duracao_segundos", 0)
            )
        except (TypeError, ValueError):
            return {
                "erro": True,
                "mensagem": "Os dados do resultado são inválidos."
            }

        if not atividade or not categoria:
            return {
                "erro": True,
                "mensagem": (
                    "Atividade e categoria são obrigatórias."
                )
            }

        if acertos < 0 or erros < 0 or duracao_segundos < 0:
            return {
                "erro": True,
                "mensagem": "Os valores não podem ser negativos."
            }

        if acertos + erros == 0:
            return {
                "erro": True,
                "mensagem": (
                    "Informe pelo menos um acerto ou erro."
                )
            }

        try:
            object_id_crianca = ObjectId(crianca_id)
        except InvalidId:
            return {
                "erro": True,
                "mensagem": "Criança inválida."
            }

        crianca = db.criancas.find_one({
            "_id": object_id_crianca
        })

        if not crianca:
            return {
                "erro": True,
                "mensagem": "Criança não encontrada."
            }

        categoria_doc = db.categorias.find_one({
            "titulo": categoria,
            "ativo": True
        })

        if not categoria_doc:
            return {
                "erro": True,
                "mensagem": "Categoria não encontrada."
            }

        agora = datetime.utcnow()
        total_tentativas = acertos + erros

        # Atualiza o progresso na categoria.
        progresso = db.progresso.find_one({
            "crianca_id": object_id_crianca,
            "categoria_id": categoria_doc["_id"]
        })

        if progresso:
            novo_total = (
                progresso.get("total_exercicios", 0)
                + total_tentativas
            )

            novos_acertos = (
                progresso.get("acertos", 0)
                + acertos
            )

            novos_erros = (
                progresso.get("erros", 0)
                + erros
            )

            db.progresso.update_one(
                {"_id": progresso["_id"]},
                {
                    "$set": {
                        "total_exercicios": novo_total,
                        "exercicios_completos": novo_total,
                        "acertos": novos_acertos,
                        "erros": novos_erros,
                        "porcentagem": (
                            novos_acertos / novo_total
                        ),
                        "updatedAt": agora
                    }
                }
            )
        else:
            db.progresso.insert_one({
                "crianca_id": object_id_crianca,
                "categoria_id": categoria_doc["_id"],
                "titulo_categoria": categoria_doc["titulo"],
                "cor": categoria_doc.get(
                    "cor_fundo",
                    "#CBE6B4"
                ),
                "total_exercicios": total_tentativas,
                "exercicios_completos": total_tentativas,
                "acertos": acertos,
                "erros": erros,
                "porcentagem": acertos / total_tentativas,
                "createdAt": agora,
                "updatedAt": agora,
                "__v": 0
            })

        # Atualiza o uso diário.
        inicio_dia = agora.replace(
            hour=0,
            minute=0,
            second=0,
            microsecond=0
        )
        fim_dia = inicio_dia + timedelta(days=1)

        registro = db.registro_uso.find_one({
            "crianca_id": object_id_crianca,
            "data": {
                "$gte": inicio_dia,
                "$lt": fim_dia
            }
        })

        minutos = max(1, ceil(duracao_segundos / 60))

        if registro:
            atividades = registro.get(
                "atividades_acessadas",
                []
            )

            atividade_encontrada = False

            for item in atividades:
                if item.get("titulo") == atividade:
                    item["vezes_acessada"] = (
                        item.get("vezes_acessada", 0) + 1
                    )
                    atividade_encontrada = True
                    break

            if not atividade_encontrada:
                atividades.append({
                    "titulo": atividade,
                    "vezes_acessada": 1,
                    "emoji": "🎮"
                })

            db.registro_uso.update_one(
                {"_id": registro["_id"]},
                {
                    "$set": {
                        "minutos_uso": (
                            registro.get("minutos_uso", 0)
                            + minutos
                        ),
                        "acertos_no_dia": (
                            registro.get("acertos_no_dia", 0)
                            + acertos
                        ),
                        "atividades_acessadas": atividades,
                        "updatedAt": agora
                    }
                }
            )
        else:
            dias_semana = [
                "Seg", "Ter", "Qua", "Qui",
                "Sex", "Sáb", "Dom"
            ]

            db.registro_uso.insert_one({
                "crianca_id": object_id_crianca,
                "data": agora,
                "dia_semana": dias_semana[agora.weekday()],
                "minutos_uso": minutos,
                "cor": categoria_doc.get(
                    "cor_fundo",
                    "#CBE6B4"
                ),
                "acertos_no_dia": acertos,
                "atividades_acessadas": [{
                    "titulo": atividade,
                    "vezes_acessada": 1,
                    "emoji": "🎮"
                }],
                "createdAt": agora,
                "updatedAt": agora,
                "__v": 0
            })

        # Cada acerto vale 10 pontos.
        db.criancas.update_one(
            {"_id": object_id_crianca},
            {
                "$inc": {
                    "pontuacao.total_pontos": acertos * 10,
                    "pontuacao.acertos_diarios": acertos
                },
                "$set": {
                    "updatedAt": agora
                }
            }
        )

        return {
            "erro": False,
            "mensagem": "Resultado registrado com sucesso.",
            "resultado": {
                "atividade": atividade,
                "categoria": categoria,
                "acertos": acertos,
                "erros": erros,
                "pontos_ganhos": acertos * 10
            }
        }