// __tests__/setup.js

// Mock do useRouter para simular a navegação em todos os testes
jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
    useLocalSearchParams: () => ({
        id: '1', // Mock de um ID padrão para a tela de simulação
    }),
    Link: 'Link', // Mock do componente Link
    Stack: { Screen: 'Screen' }, // Mock do Stack
}));

// Mock da API global `fetch` para evitar chamadas de rede reais durante os testes
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]), // Retorna um array vazio por padrão
  })
);
