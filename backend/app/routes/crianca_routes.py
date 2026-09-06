from flask import Blueprint, jsonify, request
from app.controllers.crianca_controller import CriancaController

crianca_bp = Blueprint('crianca_bp', __name__)

@crianca_bp.route('/api/crianca/listar', methods=['GET'])
def listar_criancas():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'erro': True, 'mensagem': 'Token não fornecido'}), 401

    try:
        if hasattr(CriancaController, 'listar_por_responsavel'):
            return CriancaController.listar_por_responsavel(request)
        if hasattr(CriancaController, 'listar'):
            return CriancaController.listar(request)
        
        return jsonify({'erro': True, 'mensagem': 'Método de listagem não encontrado no controller'}), 500
    except Exception as e:
        return jsonify({'erro': True, 'mensagem': str(e)}), 500

@crianca_bp.route('/api/crianca/<id>', methods=['GET'])
def buscar_crianca(id):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'erro': True, 'mensagem': 'Token não fornecido'}), 401

    try:
        if hasattr(CriancaController, 'buscar_por_id'):
            return CriancaController.buscar_por_id(id)
        if hasattr(CriancaController, 'detalhes'):
            return CriancaController.detalhes(id)
        if hasattr(CriancaController, 'obter'):
            return CriancaController.obter(id)
        
        return jsonify({'erro': True, 'mensagem': 'Método de busca não encontrado no controller'}), 500
    except Exception as e:
        return jsonify({'erro': True, 'mensagem': str(e)}), 500