/* @hack fix https://youtrack.jetbrains.com/issue/WEB-62299/types-are-not-properly-resolved-when-using-pnpm */
/// <reference types="@types/jest" />

// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};
import 'jest-preset-angular/setup-jest';
