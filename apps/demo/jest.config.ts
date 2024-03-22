/* eslint-disable */
import swcAngularPreset from '@jscutlery/swc-angular-preset';

const jestPresetAngular = {
  '^.+\\.(ts|mjs|js|html)$': [
    'jest-preset-angular',
    {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  ],
};

const swc = {
  '^.+\\.(html)$': [
    'jest-preset-angular',
    {
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  ],
  '^.+\\.(mjs|ts)$': ['@swc/jest', swcAngularPreset],
};
export default {
  displayName: 'demo',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/demo',
  transform: jestPresetAngular,
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
