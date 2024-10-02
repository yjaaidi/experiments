import { expect, test as baseTest } from 'vitest';
import { render } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
export { expect };

import { Ivya, getByRoleSelector } from 'ivya';

const ivya = Ivya.create({
  browser: 'chromium',
  testIdAttribute: 'data-test-id',
});

export const test = baseTest.extend<{
  mount(cmp: any): Promise<Locator>;
}>({
  // eslint-disable-next-line no-empty-pattern
  async mount({}, use) {
    await use(_mount);

    async function _mount(cmp: any) {
      await render(cmp);
      return new Locator('#root');
    }
  },
});

expect.extend({
  async toHaveText(received, expected) {
    return await vi.waitFor(() => {
      expect(
        ivya
          .queryLocatorSelectorAll(received._selector, document.body)
          ?.map((el) => el.textContent),
      ).toEqual(expected);
      return {
        pass: true,
        message() {
          return 'ok';
        },
      };
    });
  },
});

class Locator {
  constructor(public _selector: string) {}

  getByRole(role: string, options: any) {
    return new Locator(`${getByRoleSelector(role, options)}`);
  }
}
