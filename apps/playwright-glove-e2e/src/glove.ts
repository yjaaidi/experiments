/* eslint-disable @typescript-eslint/no-explicit-any */
import { Locator } from '@playwright/test';

/**
 * Motivation of using this instead of a class with some static methods:
 * - locators are necessarily synchronous functions
 */
export function createGlove<DEFINITION extends GloveDefinition<any>>(
  definition: DEFINITION
): GloveLocator<GloveType<DEFINITION>> & LocatorMethods<DEFINITION> {
  const { gloveFactory, locators } = definition;

  /* Transform all locators like:
   * {
   *  default: (parent) => parent.getByRole('spinbutton'),
   *  withName: (parent, { name }: { name: string }) => parent.getByRole('spinbutton', { name }),
   * }
   *
   * into:
   * {
   *  default: () => gloveFactory({locator: locators.default(parent), loader}),
   *  withName: ({ name }: { name: string }) => gloveFactory({locator: locators.withName(parent, {name}), loader}),
   * }
   */
  const locatorsWrappers: Record<
    string,
    (...args: any[]) => __GloveLocatorInternal<GloveType<DEFINITION>>
  > = {};
  for (const [name, locatorFactory] of Object.entries(locators)) {
    locatorsWrappers[name] = (...args: unknown[]) => {
      return {
        __createGlove({ parent }) {
          /* Create a Playwright locator. */
          const locator = locatorFactory(parent, ...args);
          /* Create a loader scoped to the glove locator. */
          const loader = new GloveLoader(locator);
          /* Create the glove instance scoped to the provided locator. */
          return gloveFactory({ locator, loader });
        },
      } satisfies __GloveLocatorInternal<GloveType<DEFINITION>>;
    };
  }

  return locatorsWrappers as any;
}

export interface GloveDefinition<GLOVE> {
  locators: Record<string, (parent: Locator, ...args: any[]) => Locator>;
  gloveFactory: GloveFactory<GLOVE>;
}

interface GloveFactory<GLOVE> {
  (args: { locator: Locator; loader: GloveLoader }): GLOVE;
}

type GloveType<DEFINITION> = DEFINITION extends GloveDefinition<infer GLOVE>
  ? GLOVE
  : never;

type LocatorMethods<DEFINITION extends GloveDefinition<any>> = {
  [LOCATOR_NAME in keyof DEFINITION['locators']]: (
    ...args: DropFirst<Parameters<DEFINITION['locators'][LOCATOR_NAME]>>
  ) => GloveLocator<GloveType<DEFINITION>>;
};

type DropFirst<LIST extends unknown[]> = LIST extends [any, ...infer REST]
  ? REST
  : never;

export class GloveLoader {
  constructor(private _rootLocator: Locator) {}

  getGlove<GLOVE>(
    locator: GloveLocator<GLOVE> | { default(): GloveLocator<GLOVE> }
  ): GLOVE {
    const _locator = 'default' in locator ? locator.default() : locator;
    const { __createGlove } = _toInternalGloveLocator(_locator);
    return __createGlove({ parent: this._rootLocator });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class GloveLocator<GLOVE> {
  private __gloveLocatorBrand: unknown;
}

interface __GloveLocatorInternal<GLOVE> {
  __createGlove(args: { parent: Locator }): GLOVE;
}

function _toInternalGloveLocator<GLOVE>(
  locator: GloveLocator<GLOVE>
): __GloveLocatorInternal<GLOVE> {
  return locator as any;
}
