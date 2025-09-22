from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid
import math

app = Flask(__name__)
CORS(app)

# --- Banco de Dados em Memória (para simulação) ---
produtos_db = [
    {
        "id": "1",
        "nome": "Crédito Pessoal Rápido",
        "taxaJurosAnual": 19.9,
        "prazoMaximoMeses": 24,
    },
    {
        "id": "2",
        "nome": "Financiamento de Veículo",
        "taxaJurosAnual": 15.5,
        "prazoMaximoMeses": 60,
    },
    {
        "id": "3",
        "nome": "Capital de Giro MEI",
        "taxaJurosAnual": 12.0,
        "prazoMaximoMeses": 36,
    },
]


# --- Endpoints da API ---

@app.route("/produtos", methods=["GET"])
def get_produtos():
    """Endpoint para listar todos os produtos de empréstimo."""
    return jsonify(produtos_db)


@app.route("/produtos", methods=["POST"])
def create_produto():
    """Endpoint para cadastrar um novo produto."""
    novo_produto = request.json
    # Validação simples
    if not novo_produto or 'nome' not in novo_produto or 'taxaJurosAnual' not in novo_produto:
        return jsonify({"erro": "Dados incompletos"}), 400

    produto = {
        "id": str(uuid.uuid4()),  # Gera um ID único
        "nome": novo_produto["nome"],
        "taxaJurosAnual": novo_produto["taxaJurosAnual"],
        "prazoMaximoMeses": novo_produto["prazoMaximoMeses"],
    }
    produtos_db.append(produto)
    return jsonify(produto), 201


@app.route("/simulacoes", methods=["POST"])
def perform_simulacao():
    """Endpoint para realizar o cálculo da simulação (Tabela Price)."""
    dados_simulacao = request.json
    if not dados_simulacao or 'produtoId' not in dados_simulacao or 'valorDesejado' not in dados_simulacao or 'prazo' not in dados_simulacao:
        return jsonify({"erro": "Dados de simulação incompletos"}), 400

    produto_id = dados_simulacao["produtoId"]
    valor_desejado = float(dados_simulacao["valorDesejado"])
    prazo_meses = int(dados_simulacao["prazo"])

    # Encontra o produto no nosso "banco de dados"
    produto = next((p for p in produtos_db if p["id"] == produto_id), None)
    if not produto:
        return jsonify({"erro": "Produto não encontrado"}), 404

    # --- Lógica de Cálculo Financeiro ---
    taxa_anual = produto["taxaJurosAnual"] / 100
    # Converte a taxa anual para mensal (fórmula de juros compostos)
    taxa_mensal = (1 + taxa_anual) ** (1 / 12) - 1

    # Fórmula do financiamento (Tabela Price)
    if taxa_mensal > 0:
        valor_parcela = valor_desejado * (taxa_mensal * (1 + taxa_mensal) ** prazo_meses) / (
                    (1 + taxa_mensal) ** prazo_meses - 1)
    else:  # Caso de juros zero
        valor_parcela = valor_desejado / prazo_meses

    valor_total_com_juros = valor_parcela * prazo_meses

    # Geração da memória de cálculo (tabela de amortização)
    memoria_calculo = []
    saldo_devedor_atual = valor_desejado

    for mes in range(1, prazo_meses + 1):
        juros_mes = saldo_devedor_atual * taxa_mensal
        amortizacao = valor_parcela - juros_mes
        saldo_devedor_atual -= amortizacao

        # Garante que o saldo devedor não fique negativo no final por arredondamentos
        if mes == prazo_meses and abs(saldo_devedor_atual) < 0.01:
            saldo_devedor_atual = 0

        memoria_calculo.append({
            "mes": mes,
            "juros": round(juros_mes, 2),
            "amortizacao": round(amortizacao, 2),
            "saldoDevedor": round(saldo_devedor_atual, 2)
        })

    # Monta a resposta final
    resultado = {
        "produtoNome": produto["nome"],
        "valorSolicitado": valor_desejado,
        "prazo": prazo_meses,
        "taxaJurosMensal": round(taxa_mensal * 100, 2),
        "taxaJurosAnual": produto["taxaJurosAnual"],
        "valorParcela": round(valor_parcela, 2),
        "valorTotalComJuros": round(valor_total_com_juros, 2),
        "memoriaCalculo": memoria_calculo
    }

    return jsonify(resultado)


# Roda o servidor de desenvolvimento
if __name__ == "__main__":
    app.run(debug=True, port=5000, host='0.0.0.0')
