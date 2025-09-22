// jest.config.js
module.exports = {
  preset: 'jest-expo',
  // O setupFiles AfterEnv é o local ideal para mocks globais
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  // Habilita a coleta de cobertura de testes
  collectCoverage: true,
  // Define de quais arquivos a cobertura deve ser coletada, ignorando arquivos de configuração
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/jest.config.js",
  ],
};
