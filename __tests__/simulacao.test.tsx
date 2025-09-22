import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import SimulacaoScreen from '../app/produto/[id]';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

// Mock do produto que a API retornaria para o ID '1'
const mockProdutoDetalhe = { id: '1', nome: 'Crédito Pessoal Rápido', taxaJurosAnual: 19.9, prazoMaximoMeses: 24 };

describe('Tela de Simulação de Empréstimo', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (useRouter().push as jest.Mock).mockClear();
    
    // Mock para a busca inicial dos detalhes do produto
    (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockProdutoDetalhe]),
    });
  });

  it('renderiza os detalhes do produto e o formulário', async () => {
    render(<SimulacaoScreen />);
    
    // Aguarda que os detalhes do produto sejam carregados e exibidos
    await waitFor(() => {
        expect(screen.getByText('Crédito Pessoal Rápido')).toBeTruthy();
        expect(screen.getByText('Taxa de Juros: 19.9% a.a.')).toBeTruthy();
    });

    expect(screen.getByPlaceholderText('Ex: 5000')).toBeTruthy();
    expect(screen.getByText('Simular Empréstimo')).toBeTruthy();
  });

  it('exibe um alerta se o prazo for maior que o permitido', async () => {
    render(<SimulacaoScreen />);
    const alertSpy = jest.spyOn(Alert, 'alert');

    // Aguarda o carregamento
    await waitFor(() => expect(screen.getByText('Crédito Pessoal Rápido')).toBeTruthy());
    
    fireEvent.changeText(screen.getByPlaceholderText('Ex: 5000'), '10000');
    // Prazo de 30 meses é maior que o máximo de 24 do produto mockado
    fireEvent.changeText(screen.getByPlaceholderText('Até 24 meses'), '30'); 
    
    fireEvent.press(screen.getByText('Simular Empréstimo'));

    expect(alertSpy).toHaveBeenCalledWith('Prazo Inválido', 'O prazo não pode exceder 24 meses.');
  });

  it('chama a API de simulação e navega para o modal com sucesso', async () => {
    // Mock para a chamada da API de simulação
    const mockResultadoSimulacao = { valorParcela: 500 };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResultadoSimulacao),
    });

    render(<SimulacaoScreen />);
    const mockRouter = useRouter();

    await waitFor(() => expect(screen.getByText('Crédito Pessoal Rápido')).toBeTruthy());
    
    fireEvent.changeText(screen.getByPlaceholderText('Ex: 5000'), '5000');
    fireEvent.changeText(screen.getByPlaceholderText('Até 24 meses'), '12'); 

    fireEvent.press(screen.getByText('Simular Empréstimo'));
    // PARA CELULAR É PRECISA UTILIZAR O IPV4 DA MÁQUINA NO LUGAR DE 'localhost' -> 192.168.0.2
    // Aguarda a chamada à API de simulação
    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
            'http://192.168.0.2:5000/simulacoes',
            //'http://localhost:5000/simulacoes',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    produtoId: '1',
                    valorDesejado: 5000,
                    prazo: 12,
                }),
            })
        );
    });

    // Verifica se a navegação para o modal ocorreu com os parâmetros corretos
    await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith({
            pathname: '/modal',
            params: { resultado: JSON.stringify(mockResultadoSimulacao) },
        });
    });
  });
});
