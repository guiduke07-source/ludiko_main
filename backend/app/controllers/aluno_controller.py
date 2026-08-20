from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity

from app.services.aluno_service import AlunoService


class AlunoController:

    @staticmethod
    def cadastrar():

        dados = request.get_json()

        resposta = AlunoService.cadastrar(dados)

        if resposta["erro"]:
            return jsonify(resposta), 400

        return jsonify(resposta), 201

    @staticmethod
    def listar():

        resposta = AlunoService.listar()

        return jsonify(resposta), 200

    @staticmethod
    def buscar_por_id(aluno_id):

        resposta = AlunoService.buscar_por_id(aluno_id)

        if resposta["erro"]:
            return jsonify(resposta), 404

        return jsonify(resposta), 200

    @staticmethod
    def atualizar(aluno_id):

        dados = request.get_json()

        resposta = AlunoService.atualizar(
            aluno_id,
            dados
        )

        if resposta["erro"]:

            if resposta["mensagem"] == "Aluno não encontrado.":
                return jsonify(resposta), 404

            return jsonify(resposta), 400

        return jsonify(resposta), 200

    @staticmethod
    def me():

        usuario_id = get_jwt_identity()

        resposta = AlunoService.buscar_por_usuario_id(usuario_id)

        if resposta["erro"]:
            return jsonify(resposta), 404

        return jsonify(resposta), 200