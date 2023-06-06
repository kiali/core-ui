module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!<rootDir>/node_modules/'],
  /*coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
      branch: 80
    }
  },*/
  coverageReporters: ['json-summary', 'text', 'lcov'],
  coverageDirectory: '.coverage',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  modulePathIgnorePatterns: ['<rootDir>/lib/'],
  restoreMocks: true,
  clearMocks: true,
  resetMocks: true
};
