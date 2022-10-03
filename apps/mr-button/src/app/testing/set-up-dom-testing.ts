import '@testing-library/jest-dom';
import { configure } from '@testing-library/dom';

import '../../styles.css';
import '../../../../../node_modules/@angular/material/prebuilt-themes/indigo-pink.css';

/**
 * We avoid using test-setup.ts because this adds lots of transforms etc...
 * ... so we just import it in the tests that need it.
 */
export function setUpDomTesting() {
  configure({
    testIdAttribute: 'data-role',
  });
}
