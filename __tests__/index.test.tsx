import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import ListaProdutosScreen from '../app/(tabs)/index';
import { useFocusEffect } from 'expo-router';

// Mock do useFocusEffect para podermos controlar a chamada da API
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'), // Importa os mocks já existentes
  useFocusEffect: jest.fn(),
}));

const mockProdutos = [
    { id: '1', nome: 'Crédito Pessoal Rápido', taxaJurosAnual: 19.9, prazoMaximoMeses: 24 },
    { id: '2', nome: 'Financiamento de Veículo', taxaJurosAnual: 15.5, prazoMaximoMeses: 60 },
];

describe('Tela de Listagem de Produtos', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (useFocusEffect as jest.Mock).mockImplementation(f => f()); // Executa a função do useFocusEffect imediatamente
  });

  it('exibe o indicador de carregamento e depois lista os produtos', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProdutos),
    });

    render(<ListaProdutosScreen />);

    // Verifica se o loading está visível inicialmente
    expect(screen.getByText('Carregando produtos...')).toBeTruthy();

    // Aguarda a renderização da lista
    await waitFor(() => {
      expect(screen.getByText('Crédito Pessoal Rápido')).toBeTruthy();
      expect(screen.getByText('Financiamento de Veículo')).toBeTruthy();
    });

    // Garante que o loading sumiu
    expect(screen.queryByText('Carregando produtos...')).toBeNull();
  });

  it('chama a API de produtos quando a tela ganha foco', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
    });
    
    render(<ListaProdutosScreen />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://192.168.0.2:5000/produtos');
      // expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/produtos');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('exibe uma mensagem quando não há produtos cadastrados', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]), // API retorna lista vazia
    });

    render(<ListaProdutosScreen />);

    await waitFor(() => {
      expect(screen.getByText('Nenhum produto cadastrado ainda.')).toBeTruthy();
    });
  });
});
