/* eslint-disable */
export default {
  displayName: 'mr-button',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/mr-button',
  transform: {
    /* Using @swc/jest instead of jest-preset-angular
     * because jest-preset-angular strips component styles.
     * ts-jest didn't work as it seemed to ignore modules/.../*.mjs.
     * @swc/jest worked out of the box. */
    '^.+\\.(ts|mjs)$': '@swc/jest',
    /* Let jest-preview handle the styling and the rest. */
    '^.+\\.(css|scss|sass|less)$': 'jest-preview/transforms/css',
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)':
      'jest-preview/transforms/file',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.(css|mjs)$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
