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
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },
  modulePathIgnorePatterns: ['<rootDir>/lib/']
};
