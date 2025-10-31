module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'text-summary', 'json-summary'],
  collectCoverageFrom: [
    'tests/calculator-wrapper.js',
    'src/routes/*.js',
    '!src/server.js',
    '!**/node_modules/**',
    '!**/coverage/**'
  ],
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.tests.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    'src/server.js'
  ],
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};