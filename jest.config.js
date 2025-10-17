module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    'public/js/**/*.js',
    '!src/server.js'
  ],
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.tests.js'
  ],
  verbose: true
};