/* eslint-disable */
import swcAngularPreset from '@jscutlery/swc-angular-preset';

export default {
  displayName: 'demo',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/demo',
  transform: {
    '^.+\\.(html)$': [
      'jest-preset-angular',
      {
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
    '^.+\\.(mjs|ts)$': ['@swc/jest', swcAngularPreset],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
