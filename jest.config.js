module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/main.ts',
    '!src/**/*.config.ts',
    '!src/environments/*.ts'
  ],
  coverageDirectory: 'coverage',
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@services/(.*)$': '<rootDir>/src/app/services/$1',
    '^@environments/(.*)$': '<rootDir>/src/environments/$1'
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  testEnvironment: 'jsdom'
};

