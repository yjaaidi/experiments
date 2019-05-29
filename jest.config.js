// https://github.com/thymikee/jest-preset-angular#brief-explanation-of-config

const tsJestPreset = require('jest-preset-angular/jest-preset').globals['ts-jest'];

module.exports = {
  preset: 'jest-preset-angular',
  roots: ['src'],
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@assets/(.*)': '<rootDir>/src/assets/$1',
    '@core/(.*)': '<rootDir>/src/app/core/$1',
    '@env': '<rootDir>/src/environments/environment',
    '@src/(.*)': '<rootDir>/src/src/$1',
    '@state/(.*)': '<rootDir>/src/app/state/$1'
  },
  transformIgnorePatterns: ['node_modules/(?!(jest-test))'],
  globals: {
    'ts-jest': {
      ...tsJestPreset,
      tsConfig: 'tsconfig.spec.json'
    }
  }
};
