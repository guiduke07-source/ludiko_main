from bson.objectid import ObjectId
from flask import jsonify

class CriancaController:

    @staticmethod
    def buscar_por_id(id):
        try:
            from app import db # ou o seu objeto do MongoDB / Model
            
            filtro_id = ObjectId(id) if ObjectId.is_valid(id) else id
            
            # Busca na coleção de crianças (ou usuarios)
            crianca = None
            if hasattr(db, 'criancas'):
                crianca = db.criancas.find_one({'_id': filtro_id})
            elif hasattr(db, 'usuarios'):
                crianca = db.usuarios.find_one({'_id': filtro_id})

            if not crianca:
                return jsonify({'erro': True, 'mensagem': 'Criança não encontrada'}), 404

            return jsonify({
                'erro': False,
                'id': str(crianca.get('_id', id)),
                'nome': crianca.get('nome', 'Filho')
            }), 200

        except Exception as e:
            return jsonify({'erro': True, 'mensagem': str(e)}), 500