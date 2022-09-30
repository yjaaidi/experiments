import 'jest-preset-angular/setup-jest';

import { configure } from '@testing-library/dom';

configure({
  testIdAttribute: 'data-role',
});
