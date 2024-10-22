import { expect, test } from '../testing/test';
import { HelloComponent } from './hello.component';

test('says hello', async ({ page, mount }) => {
  await mount(HelloComponent);

  await expect(page.getByRole('heading')).toHaveText('Hello!');
});
