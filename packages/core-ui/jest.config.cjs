module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/components/**/*.{js,jsx,ts,tsx}', '!<rootDir>/node_modules/'],
  /*coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
      branch: 80
    }
  },*/
  coverageReporters: ['json-summary', 'text', 'lcov'],
  coverageDirectory: '.coverage',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  setupFiles: ['./setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/src/__mocks__/styleMock.cjs',
    '@kiali/types': '<rootDir>/../types/lib/index.esm.js'
  },
  modulePathIgnorePatterns: ['<rootDir>/lib/']
};
