module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/*.spec.ts'
  ],
  watchPathIgnorePatterns: [
    'node_modules'
  ]
};