from datetime import datetime

from bson import ObjectId
from bson.errors import InvalidId

from app.database.mongodb import db
from app.utils.hash import gerar_hash


class CriancaService:

    @staticmethod
    def cadastrar(responsavel_id, dados):

        nome = dados.get("nome", "").strip()
        cpf = "".join(
            filter(str.isdigit, dados.get("cpf", ""))
        )
        senha = dados.get("senha", "")
        data_nascimento = dados.get(
            "data_nascimento",
            ""
        ).strip()

        if not nome or not cpf or not senha or not data_nascimento:
            return {
                "erro": True,
                "mensagem": "Todos os campos são obrigatórios."
            }

        try:
            object_id_responsavel = ObjectId(responsavel_id)
            data_formatada = datetime.strptime(
                data_nascimento,
                "%Y-%m-%d"
            )
        except InvalidId:
            return {
                "erro": True,
                "mensagem": "Responsável inválido."
            }
        except ValueError:
            return {
                "erro": True,
                "mensagem": "Data de nascimento inválida."
            }

        responsavel = db.responsaveis.find_one({
            "_id": object_id_responsavel
        })

        if not responsavel:
            return {
                "erro": True,
                "mensagem": "Responsável não encontrado."
            }

        crianca_existente = db.criancas.find_one({
            "cpf": cpf
        })

        if crianca_existente:
            return {
                "erro": True,
                "mensagem": "Já existe uma criança com este CPF."
            }

        nova_crianca = {
            "nome": nome,
            "cpf": cpf,
            "senha_hash": gerar_hash(senha),
            "cpf_responsavel": responsavel.get("cpf"),
            "data_nascimento": data_formatada,
            "avatar": {
                "imagem_url": "",
                "personagem": "default",
                "cor_tema": "#CEB1DE"
            },
            "pontuacao": {
                "total_pontos": 0,
                "acertos_diarios": 0,
                "dias_consecutivos": 0
            },
            "responsavel_id": object_id_responsavel,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
            "__v": 0
        }

        resultado = db.criancas.insert_one(nova_crianca)

        db.responsaveis.update_one(
            {"_id": object_id_responsavel},
            {
                "$addToSet": {
                    "criancas_ids": resultado.inserted_id
                },
                "$set": {
                    "updatedAt": datetime.utcnow()
                }
            }
        )

        return {
            "erro": False,
            "mensagem": "Criança cadastrada com sucesso.",
            "crianca": {
                "id": str(resultado.inserted_id),
                "nome": nome
            }
        }