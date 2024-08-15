import { Type } from '@angular/core';
import { test as base, expect, Locator } from '@playwright/test';

const test = base.extend<{ gloveLoader: GloveLoader }>({
  gloveLoader: async ({ page }, use) => {
    await use(new GloveLoader(page.locator('body')));
  },
});

test('has title', async ({ page, gloveLoader }) => {
  const mainDatePicker = gloveLoader.getGlove(
    DatepickerGlove.with({ name: 'main' })
  );

  await page.goto('/');

  await mainDatePicker.setDate({
    day: 1,
    month: 1,
    year: 2022,
  });

  await expect(page.getByRole('article')).toHaveText('Jan 1, 2022');
});

class DatepickerGlove {
  private _loader: GloveLoader;
  constructor(private _locator: Locator) {
    this._loader = new GloveLoader(this._locator);
  }

  static factory = createGloveFactory(
    ({ within }) => new DatepickerGlove(within.getByTestId('datepicker'))
  );

  static with({ name }: { name: string }) {
    return createGloveFactory(
      ({ within }) =>
        new DatepickerGlove(
          within.getByTestId('datepicker').and(within.getByLabel(name))
        )
    );
  }

  first() {
    return new DatepickerGlove(this._locator.first());
  }

  async setDate({
    day,
    month,
    year,
  }: {
    day: number;
    month: number;
    year: number;
  }) {
    await this._loader
      .getGlove(TextFieldGlove.with({ name: 'day' }))
      .fill(day.toString());
    await this._locator.getByLabel('month').fill(`${month}`);
    await this._locator.getByLabel('year').fill(`${year}`);
  }
}

class TextFieldGlove {
  constructor(private _locator: Locator) {}

  static with({ name }: { name: string }) {
    return createGloveFactory(
      ({ within }) =>
        new TextFieldGlove(within.getByRole('spinbutton', { name }))
    );
  }

  async fill(value: string) {
    return await this._locator.fill(value);
  }
}

class GloveLoader {
  constructor(private _rootLocator: Locator) {}

  getGlove<GLOVE>(glove: GloveType<GLOVE> | GloveFactory<GLOVE>) {
    const within = this._rootLocator;
    return 'factory' in glove ? glove.factory({ within }) : glove({ within });
  }
}

type GloveType<GLOVE> = Type<GLOVE> & { factory: GloveFactory<GLOVE> };

interface GloveFactory<GLOVE> {
  ({ within }: { within: Locator }): GLOVE;
}

function createGloveFactory<GLOVE>(
  factoryFn: (args: { within: Locator }) => GLOVE
) {
  return factoryFn;
}
