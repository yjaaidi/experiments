import { test as base, expect } from '@playwright/test';
import { createGlove, GloveDefinition, GloveLoader } from './glove';

const test = base.extend<{ gloveLoader: GloveLoader }>({
  gloveLoader: async ({ page }, use) => {
    await use(new GloveLoader(page.locator('body')));
  },
});

test('has title', async ({ page, gloveLoader }) => {
  // const mainDatePicker = gloveLoader.getGlove(DatepickerGlove);
  const mainDatePicker = gloveLoader.getGlove(DatepickerGlove.first());

  await page.goto('/');

  await mainDatePicker.setDate({
    day: 1,
    month: 1,
    year: 2022,
  });

  await expect(page.getByRole('article')).toHaveText('Jan 1, 2022');
});

const DatepickerGlove = createGlove({
  locators: {
    default: (parent) => parent.getByTestId('datepicker'),
    first: (parent) => parent.getByTestId('datepicker').first(),
  },
  gloveFactory({ loader }) {
    function setField(name: string, value: number) {
      return loader
        .getGlove(TextFieldGlove.with({ name }))
        .fill(value.toString());
    }

    return {
      async setDate({
        day,
        month,
        year,
      }: {
        day: number;
        month: number;
        year: number;
      }) {
        await setField('day', day);
        await setField('month', month);
        await setField('year', year);
      },
    };
  },
});

const TextFieldGlove = createGlove({
  locators: {
    with: (parent, { name }: { name: string }) =>
      parent.getByRole('spinbutton', { name }),
  },
  gloveFactory({ locator }) {
    return {
      async fill(value: string) {
        return await locator.fill(value);
      },
    };
  },
});
