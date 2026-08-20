from datetime import datetime


class Aluno:

    @staticmethod
    def criar(
        usuario_id,
        nome,
        email,
        data_nascimento=None,
        responsavel_id=None,
        turma=None
    ):

        return {
            "usuario_id": usuario_id,
            "nome": nome,
            "email": email.lower(),
            "data_nascimento": data_nascimento,
            "responsavel_id": responsavel_id,
            "turma": turma,
            "ativo": True,
            "criado_em": datetime.utcnow()
        }