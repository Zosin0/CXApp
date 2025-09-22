import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CadastrarScreen from '../app/(tabs)/cadastrar';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

describe('Tela de Cadastro', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (useRouter().push as jest.Mock).mockClear();
  });

  it('renderiza os componentes do formulário', () => {
    const { getByText, getByPlaceholderText } = render(<CadastrarScreen />);
    
    expect(getByText('Nome do Produto')).toBeTruthy();
    expect(getByPlaceholderText('Ex: Empréstimo para reforma')).toBeTruthy();
    expect(getByText('Cadastrar Produto')).toBeTruthy();
  });

  it('exibe um alerta se os campos estiverem vazios na submissão', () => {
    const { getByText } = render(<CadastrarScreen />);
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    fireEvent.press(getByText('Cadastrar Produto'));
    
    expect(alertSpy).toHaveBeenCalledWith('Atenção', 'Todos os campos são obrigatórios.');
    // Garante que a API não foi chamada
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('chama a API com os dados corretos e navega para a home em caso de sucesso', async () => {
    // Define um mock de sucesso específico para este teste
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 'mock-id', nome: 'Crédito Teste' }),
    });

    const { getByText, getByLabelText } = render(<CadastrarScreen />);
    const mockRouter = useRouter();
    
    // Usar getByLabelText é mais acessível do que getByPlaceholderText
    fireEvent.changeText(getByLabelText('Nome do Produto'), 'Crédito Teste');
    fireEvent.changeText(getByLabelText('Taxa de Juros Anual (%)'), '25');
    fireEvent.changeText(getByLabelText('Prazo Máximo (em meses)'), '24');

    fireEvent.press(getByText('Cadastrar Produto'));

    // Aguarda a chamada da API ser feita e finalizada
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://192.168.0.2:5000/produtos',
        // 'http://localhost:5000/produtos',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            nome: 'Crédito Teste',
            taxaJurosAnual: 25,
            prazoMaximoMeses: 24,
          }),
        })
      );
    });

    // Aguarda a exibição do alerta de sucesso e a navegação
    await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Sucesso!', 'Produto cadastrado com sucesso.');
        expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('exibe um alerta de erro se a chamada da API falhar', async () => {
    // Define um mock de falha da API (ex: servidor fora do ar)
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API is down'));

    const { getByText, getByLabelText } = render(<CadastrarScreen />);
    const alertSpy = jest.spyOn(Alert, 'alert');
    
    fireEvent.changeText(getByLabelText('Nome do Produto'), 'Crédito com Falha');
    fireEvent.changeText(getByLabelText('Taxa de Juros Anual (%)'), '10');
    fireEvent.changeText(getByLabelText('Prazo Máximo (em meses)'), '12');

    fireEvent.press(getByText('Cadastrar Produto'));

    // Aguarda a exibição do alerta de erro
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Erro', 'Não foi possível conectar ao servidor.');
    });
  });
});

