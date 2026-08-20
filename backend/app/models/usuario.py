from datetime import datetime


class Usuario:

    @staticmethod
    def criar(nome, email, senha, tipo):

        return {
            "nome": nome,
            "email": email.lower(),
            "senha": senha,
            "tipo": tipo,
            "ativo": True,
            "criado_em": datetime.utcnow()
        }