module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'text-summary', 'json-summary'],
  collectCoverageFrom: [
    'tests/calculator-wrapper.js',
    '!src/server.js',
    '!src/database/db.js',
    '!src/routes/*.js',  
    '!**/node_modules/**',
    '!**/coverage/**'
  ],
  testMatch: [
    '**/tests/calculator.tests.js',
    '**/tests/utils.tests.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    'tests/api.tests.js',              // Requiere SQLite + autenticación
    'tests/records.whitebox.tests.js'  // Requiere SQLite
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    'src/server.js',
    'src/database/db.js',
    'src/routes/'  
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