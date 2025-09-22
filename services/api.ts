// Isola toda a lógica de comunicação com o backend.
// As telas não precisam saber a URL ou como o `fetch` funciona.

// ATENÇÃO: Troque 'localhost' pelo IP da sua máquina se for testar no celular físico
// const API_URL = 'http://localhost:5000';
const API_URL = 'http://192.168.0.2:5000';

// --- Tipagem para os dados da API ---
export interface Produto {
  id: string;
  nome: string;
  taxaJurosAnual: number;
  prazoMaximoMeses: number;
}

export interface NewProdutoData {
    nome: string;
    taxaJurosAnual: number;
    prazoMaximoMeses: number;
}

export interface SimulacaoPayload {
    produtoId: string;
    valorDesejado: number;
    prazo: number;
}

export interface SimulacaoResultado {
    produtoNome: string;
    valorSolicitado: number;
    prazo: number;
    taxaJurosMensal: number;
    taxaJurosAnual: number;
    valorParcela: number;
    valorTotalComJuros: number;
    memoriaCalculo: {
        mes: number;
        juros: number;
        amortizacao: number;
        saldoDevedor: number;
    }[];
}


// --- Funções da API ---

export const fetchProdutos = async (): Promise<Produto[]> => {
  const response = await fetch(`${API_URL}/produtos`);
  if (!response.ok) {
    throw new Error('Falha ao buscar produtos da API.');
  }
  return response.json();
};

export const createProduto = async (data: NewProdutoData): Promise<Produto> => {
  const response = await fetch(`${API_URL}/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Falha ao cadastrar o produto.');
  }
  return response.json();
};

export const performSimulacao = async (data: SimulacaoPayload): Promise<SimulacaoResultado> => {
  const response = await fetch(`${API_URL}/simulacoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Falha ao realizar a simulação.');
  }
  return response.json();
};
