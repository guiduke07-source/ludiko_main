from app.database.mongodb import db


class AlunoService:

    @staticmethod
    def cadastrar(dados):

        email = dados.get("email")

        usuario = db.usuarios.find_one({
            "email": email.lower()
        })

        if not usuario:
            return {
                "erro": True,
                "mensagem": "Usuário não encontrado."
            }

        aluno_existente = db.alunos.find_one({
            "usuario_id": str(usuario["_id"])
        })

        if aluno_existente:
            return {
                "erro": True,
                "mensagem": "Este usuário já possui um cadastro de aluno."
            }

        novo_aluno = {
            "usuario_id": str(usuario["_id"]),
            "nome": dados.get("nome"),
            "email": email.lower(),
            "data_nascimento": dados.get("data_nascimento"),
            "responsavel_id": dados.get("responsavel_id"),
            "turma": dados.get("turma"),
            "ativo": True
        }

        resultado = db.alunos.insert_one(novo_aluno)

        return {
            "erro": False,
            "mensagem": "Aluno cadastrado com sucesso.",
            "id": str(resultado.inserted_id)
        }

    @staticmethod
    def listar():

        alunos = db.alunos.find()

        lista = []

        for aluno in alunos:

            lista.append({
                "id": str(aluno["_id"]),
                "usuario_id": aluno.get("usuario_id"),
                "nome": aluno.get("nome"),
                "email": aluno.get("email"),
                "data_nascimento": aluno.get("data_nascimento"),
                "responsavel_id": aluno.get("responsavel_id"),
                "turma": aluno.get("turma"),
                "ativo": aluno.get("ativo", True)
            })

        return {
            "erro": False,
            "alunos": lista
        }

    @staticmethod
    def buscar_por_id(aluno_id):

        from bson import ObjectId
        from bson.errors import InvalidId

        try:
            object_id = ObjectId(aluno_id)

        except InvalidId:
            return {
                "erro": True,
                "mensagem": "ID do aluno inválido."
            }

        aluno = db.alunos.find_one({
            "_id": object_id
        })

        if not aluno:
            return {
                "erro": True,
                "mensagem": "Aluno não encontrado."
            }

        return {
            "erro": False,
            "aluno": {
                "id": str(aluno["_id"]),
                "usuario_id": aluno.get("usuario_id"),
                "nome": aluno.get("nome"),
                "email": aluno.get("email"),
                "data_nascimento": aluno.get("data_nascimento"),
                "responsavel_id": aluno.get("responsavel_id"),
                "turma": aluno.get("turma"),
                "ativo": aluno.get("ativo", True)
            }
        }

    @staticmethod
    def atualizar(aluno_id, dados):

        from bson import ObjectId
        from bson.errors import InvalidId

        try:
            object_id = ObjectId(aluno_id)

        except InvalidId:
            return {
                "erro": True,
                "mensagem": "ID do aluno inválido."
            }

        aluno = db.alunos.find_one({
            "_id": object_id
        })

        if not aluno:
            return {
                "erro": True,
                "mensagem": "Aluno não encontrado."
            }

        campos_permitidos = [
            "nome",
            "data_nascimento",
            "responsavel_id",
            "turma",
            "ativo"
        ]

        atualizacao = {}

        for campo in campos_permitidos:

            if campo in dados:
                atualizacao[campo] = dados[campo]

        if not atualizacao:
            return {
                "erro": True,
                "mensagem": "Nenhum campo para atualizar."
            }

        db.alunos.update_one(
            {"_id": object_id},
            {"$set": atualizacao}
        )

        return {
            "erro": False,
            "mensagem": "Aluno atualizado com sucesso."
        }

    @staticmethod
    def buscar_por_usuario_id(usuario_id):

        aluno = db.alunos.find_one({
            "usuario_id": usuario_id
        })

        if not aluno:
            return {
                "erro": True,
                "mensagem": "Aluno não encontrado para este usuário."
            }

        return {
            "erro": False,
            "aluno": {
                "id": str(aluno["_id"]),
                "usuario_id": aluno.get("usuario_id"),
                "nome": aluno.get("nome"),
                "email": aluno.get("email"),
                "data_nascimento": aluno.get("data_nascimento"),
                "responsavel_id": aluno.get("responsavel_id"),
                "turma": aluno.get("turma"),
                "ativo": aluno.get("ativo", True)
            }
        }