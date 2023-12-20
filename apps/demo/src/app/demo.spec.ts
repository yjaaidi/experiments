import { Service } from '@demo/ui';
import { Service as Deep } from '@demo/ui/service';

test('deep import', () => {
  expect(Service).toBe(Deep);
});
