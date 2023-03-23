module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/components/*.{js,jsx,ts,tsx}',
    "!<rootDir>/node_modules/"
  ],
  coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
      branch: 80
    }
  },
  coverageReporters: [
    "json-summary", 
    "text",
    "lcov"
  ],
  coverageDirectory: '.coverage',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [ "@testing-library/jest-dom/extend-expect" ],
  setupFiles: [
    './setupTests.ts'
  ],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      "ts-jest",
      {
        useESM: true,
      },
    ]
  },
  extensionsToTreatAsEsm: ['.ts','.tsx'], 
  transformIgnorePatterns: [
   'node_modules/(?!@patternfly)'
  ],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/src/__mocks__/styleMock.cjs'
  },
  modulePathIgnorePatterns: ["<rootDir>/lib/"]
};