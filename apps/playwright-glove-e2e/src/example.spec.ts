import { test as base, expect, Locator } from '@playwright/test';

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
    default() {
      return (parent) => parent.getByTestId('datepicker');
    },
    first() {
      return (parent) => parent.getByTestId('datepicker').first();
    },
  },
  gloveFactory({ locator, loader }) {
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
        await loader
          .getGlove(TextFieldGlove.with({ name: 'day' }))
          .fill(day.toString());
        await locator.getByLabel('month').fill(`${month}`);
        await locator.getByLabel('year').fill(`${year}`);
      },
    };
  },
});

const TextFieldGlove = createGlove({
  locators: {
    with({ name }: { name: string }) {
      return (parent) => parent.getByRole('spinbutton', { name });
    },
  },
  gloveFactory({ locator }) {
    return {
      async fill(value: string) {
        return await locator.fill(value);
      },
    };
  },
});

type GloveType<DEFINITION> = DEFINITION extends GloveDefinition<infer GLOVE>
  ? GLOVE
  : never;

function createGlove<DEFINITION extends GloveDefinition<any>>(
  definition: DEFINITION
): GloveFinder<GloveType<DEFINITION>> & {
  [FINDER_NAME in keyof DEFINITION['locators']]: (
    ...args: Parameters<DEFINITION['locators'][FINDER_NAME]>
  ) => GloveFinder<GloveType<DEFINITION>>;
} {
  const { gloveFactory } = definition;
  return Object.entries(definition.locators).reduce(
    (acc, [name, locatorFactory]) => {
      acc[name] = (...args: any[]) => {
        return {
          ɵgloveFinder: ({ parent }) => {
            const locator = locatorFactory(...args)(parent);
            return gloveFactory({
              locator,
              loader: new GloveLoader(locator),
            });
          },
        } satisfies GloveFinderInternal<GloveType<DEFINITION>>;
      };
      return acc;
    },
    {} as any
  );
}

interface GloveDefinition<GLOVE> {
  locators: Record<string, (...args: any[]) => GloveFinderDefinition>;
  gloveFactory: GloveFactory<GLOVE>;
}

interface GloveFinderDefinition {
  (parent: Locator): Locator;
}

interface GloveFactory<GLOVE> {
  (args: { locator: Locator; loader: GloveLoader }): GLOVE;
}

class GloveLoader {
  constructor(private _rootLocator: Locator) {}

  getGlove<GLOVE>(
    finder: GloveFinder<GLOVE> | { default(): GloveFinder<GLOVE> }
  ): GLOVE {
    const { ɵgloveFinder } = toInternalGloveFinder(
      'default' in finder ? finder.default() : finder
    );
    return ɵgloveFinder({ parent: this._rootLocator });
  }
}

class GloveFinder<GLOVE> {
  private ɵgloveFinder: unknown;
}

interface GloveFinderInternal<GLOVE> {
  ɵgloveFinder: (args: { parent: Locator }) => GLOVE;
}

function toInternalGloveFinder<GLOVE>(
  finder: GloveFinder<GLOVE>
): GloveFinderInternal<GLOVE> {
  return finder as any;
}
