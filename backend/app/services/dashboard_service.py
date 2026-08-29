from datetime import datetime, timezone, timedelta
from bson import ObjectId
from bson.errors import InvalidId

from app.database.mongodb import db


class DashboardService:

    CATEGORIAS_PADRAO = [
        {"titulo": "Matemática", "slug": "matematica", "cor": "#FBCFE8"},
        {"titulo": "Português", "slug": "portugues", "cor": "#CBE6B4"},
        {"titulo": "Ciências", "slug": "ciencias", "cor": "#BEE3F8"},
        {"titulo": "Conhecimentos Gerais", "slug": "conhecimentos-gerais", "cor": "#D8B4E2"}
    ]

    @staticmethod
    def _obter_info_data():
        # Fuso Horário de Brasília (UTC-3) para garantir o dia da semana correto
        fuso_br = timezone(timedelta(hours=-3))
        hoje = datetime.now(fuso_br)
        ano, semana_ano, dia_num = hoje.isocalendar()
        dias_map = {1: "Seg", 2: "Ter", 3: "Qua", 4: "Qui", 5: "Sex", 6: "Sáb", 7: "Dom"}
        return ano, semana_ano, dias_map.get(dia_num, "Seg")

    @staticmethod
    def obter_frequencia(crianca_id, ano_param=None, semana_param=None):
        try:
            object_id = ObjectId(crianca_id)
        except InvalidId:
            return {"erro": True, "mensagem": "ID da criança inválido."}

        ano_atual, semana_atual, _ = DashboardService._obter_info_data()
        ano = int(ano_param) if ano_param else ano_atual
        semana = int(semana_param) if semana_param else semana_atual

        registros = list(db.registro_uso.find({
            "crianca_id": object_id,
            "ano": ano,
            "semana_ano": semana
        }))

        dias_ordem = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
        mapa_minutos = {dia: 0 for dia in dias_ordem}
        mapa_pontos = {dia: 0 for dia in dias_ordem}

        for reg in registros:
            dia = reg.get("dia_semana") or reg.get("dia")
            if dia in mapa_minutos:
                mapa_minutos[dia] += int(reg.get("minutos_uso", 0))
                mapa_pontos[dia] += int(reg.get("acertos_no_dia", 0)) * 10

        frequencia = []
        for dia in dias_ordem:
            frequencia.append({
                "dia": dia,
                "dia_semana": dia,
                "tempo_minutos": mapa_minutos[dia],
                "minutos_uso": mapa_minutos[dia],
                "pontos": mapa_pontos[dia]
            })

        return {
            "erro": False,
            "ano": ano,
            "semana_ano": semana,
            "frequencia": frequencia
        }

    @staticmethod
    def obter_historico_semanas(crianca_id):
        try:
            object_id = ObjectId(crianca_id)
        except InvalidId:
            return {"erro": True, "mensagem": "ID da criança inválido."}

        pipeline = [
            {"$match": {"crianca_id": object_id, "ano": {"$exists": True}}},
            {
                "$group": {
                    "_id": {"ano": "$ano", "semana_ano": "$semana_ano"},
                    "total_minutos": {"$sum": "$minutos_uso"},
                    "total_acertos": {"$sum": "$acertos_no_dia"}
                }
            },
            {"$sort": {"_id.ano": -1, "_id.semana_ano": -1}}
        ]

        resultado = list(db.registro_uso.aggregate(pipeline))

        historico = []
        for item in resultado:
            historico.append({
                "ano": item["_id"]["ano"],
                "semana_ano": item["_id"]["semana_ano"],
                "total_minutos": item["total_minutos"],
                "total_pontos": item["total_acertos"] * 10
            })

        return {"erro": False, "historico": historico}

    @staticmethod
    def obter_progresso(crianca_id):
        try:
            object_id = ObjectId(crianca_id)
        except InvalidId:
            return {"erro": True, "mensagem": "ID da criança inválido."}

        registros = list(db.progresso.find({"crianca_id": object_id}))
        registros_map = {reg.get("titulo_categoria"): reg for reg in registros}

        total_acertos_geral = sum(int(reg.get("acertos", 0)) for reg in registros)

        progresso = []
        for cat in DashboardService.CATEGORIAS_PADRAO:
            titulo = cat["titulo"]
            cor = cat["cor"]
            reg = registros_map.get(titulo)

            acertos = int(reg.get("acertos", 0)) if reg else 0
            erros = int(reg.get("erros", 0)) if reg else 0

            if total_acertos_geral > 0:
                fracao = round(acertos / total_acertos_geral, 4)
                pct = round((acertos / total_acertos_geral) * 100, 1)
            else:
                fracao = 0.0
                pct = 0.0

            progresso.append({
                "categoria_id": str(reg.get("categoria_id")) if reg and reg.get("categoria_id") else str(object_id) + "_" + titulo,
                "titulo_categoria": titulo,
                "titulo": titulo,
                "porcentagem": fracao,
                "valor": fracao,
                "pct_display": pct,
                "acertos": acertos,
                "erros": erros,
                "cor": cor
            })

        return {"erro": False, "progresso": progresso}

    @staticmethod
    def registrar_partida(crianca_id, dados):
        try:
            object_id = ObjectId(crianca_id)
        except InvalidId:
            return {"erro": True, "mensagem": "ID da criança inválido."}

        minutos_gastos = int(dados.get("minutos", 15))
        categoria_titulo = str(dados.get("categoria", "Matemática")).strip()
        acertos = int(dados.get("acertos", 0))
        erros = int(dados.get("erros", 0))

        ano_atual, semana_atual, dia_atual = DashboardService._obter_info_data()
        fuso_br = timezone(timedelta(hours=-3))

        # 1. Registra os minutos e acertos na sexta-feira corrente (Horário de Brasília)
        db.registro_uso.update_one(
            {
                "crianca_id": object_id,
                "ano": ano_atual,
                "semana_ano": semana_atual,
                "dia_semana": dia_atual
            },
            {
                "$inc": {
                    "minutos_uso": minutos_gastos,
                    "acertos_no_dia": acertos
                },
                "$set": {
                    "data": datetime.now(fuso_br),
                    "dia": dia_atual
                }
            },
            upsert=True
        )

        # 2. Mapeia dados da categoria com slug e ano_escolar para evitar DuplicateKeyError
        cor_categoria = "#FBCFE8"
        slug_categoria = "geral"
        for c in DashboardService.CATEGORIAS_PADRAO:
            if c["titulo"].lower() == categoria_titulo.lower():
                cor_categoria = c["cor"]
                slug_categoria = c["slug"]
                categoria_titulo = c["titulo"]
                break

        cat_banco = db.categorias.find_one({"titulo": categoria_titulo})
        if cat_banco:
            categoria_oid = cat_banco["_id"]
        else:
            nova_cat = db.categorias.insert_one({
                "titulo": categoria_titulo,
                "slug": slug_categoria,
                "ano_escolar": "1ano",
                "cor_fundo": cor_categoria,
                "ativo": True,
                "createdAt": datetime.now(fuso_br)
            })
            categoria_oid = nova_cat.inserted_id

        # 3. Incrementa os acertos/erros no progresso
        db.progresso.update_one(
            {
                "crianca_id": object_id,
                "categoria_id": categoria_oid
            },
            {
                "$inc": {
                    "acertos": acertos,
                    "erros": erros
                },
                "$set": {
                    "titulo_categoria": categoria_titulo,
                    "cor": cor_categoria,
                    "updatedAt": datetime.now(fuso_br)
                }
            },
            upsert=True
        )

        return {"erro": False, "mensagem": "Partida registrada com sucesso!"}