/* eslint-disable @typescript-eslint/no-explicit-any */
import { Locator } from '@playwright/test';

type DropFirst<LIST extends unknown[]> = LIST extends [any, ...infer REST]
  ? REST
  : never;

export function createGlove<DEFINITION extends GloveDefinition<any>>(
  definition: DEFINITION
): GloveLocator<GloveType<DEFINITION>> & {
  [LOCATOR_NAME in keyof DEFINITION['locators']]: (
    ...args: DropFirst<Parameters<DEFINITION['locators'][LOCATOR_NAME]>>
  ) => GloveLocator<GloveType<DEFINITION>>;
} {
  const { gloveFactory } = definition;
  return Object.entries(definition.locators).reduce(
    (acc, [name, locatorFactory]) => {
      acc[name] = (...args: any[]) => {
        return {
          ɵgloveLocator: ({ parent }) => {
            const locator = locatorFactory(parent, ...args);
            return gloveFactory({
              locator,
              loader: new GloveLoader(locator),
            });
          },
        } satisfies ɵGloveLocatorInternal<GloveType<DEFINITION>>;
      };
      return acc;
    },
    {} as any
  );
}

export interface GloveDefinition<GLOVE> {
  locators: Record<string, (parent: Locator, ...args: any[]) => Locator>;
  gloveFactory: GloveFactory<GLOVE>;
}

type GloveType<DEFINITION> = DEFINITION extends GloveDefinition<infer GLOVE>
  ? GLOVE
  : never;

interface GloveFactory<GLOVE> {
  (args: { locator: Locator; loader: GloveLoader }): GLOVE;
}

export class GloveLoader {
  constructor(private _rootLocator: Locator) {}

  getGlove<GLOVE>(
    locator: GloveLocator<GLOVE> | { default(): GloveLocator<GLOVE> }
  ): GLOVE {
    const { ɵgloveLocator } = _toInternalGloveLocator(
      'default' in locator ? locator.default() : locator
    );
    return ɵgloveLocator({ parent: this._rootLocator });
  }
}

export class GloveLocator<GLOVE> {
  private ɵgloveLocator: unknown;
}

interface ɵGloveLocatorInternal<GLOVE> {
  ɵgloveLocator: (args: { parent: Locator }) => GLOVE;
}

function _toInternalGloveLocator<GLOVE>(
  locator: GloveLocator<GLOVE>
): ɵGloveLocatorInternal<GLOVE> {
  return locator as any;
}
