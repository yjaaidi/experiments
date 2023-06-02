/**
 * Provide an implementation for an abstract service using a factory function,
 * which will be lazy evaluated when the service is injected for the first time.
 *
 * @throws {ProviderAlreadyExistsError} if the service is already provided with a different factory
 *
 * @param service the abstract service to provide
 * @param useFactory the factory function to instantiate the service
 */
export function provide<T>(service: AbstractType<T>, provider: ClassProvider<SameTypeAs<T>> | ValueProvider<SameTypeAs<T>>) {
  const injectable = _injectablesMap.get(service);

  if ('value' in provider) {
    /* Different provider already set. */
    if (injectable != null && injectable.value !== provider.value) {
      throw new ProviderAlreadyExistsError(service.name);
    }
  }

  if ('useClass' in provider) {
    /* Different provider already set. */
    if (injectable != null && injectable.useClass !== provider.useClass) {
      throw new ProviderAlreadyExistsError(service.name);
    }
  }

  /* Provider not set. */
  if (injectable == null) {
    _injectablesMap.set(service, provider);
  }
}

/**
 * Inject a service by its abstract type.
 * The service must be provided before it can be injected.
 *
 * This will instantiate the service if it has not been instantiated yet.
 * The service might be instantiated even if it is not injected.
 *
 * @throws {ProviderNotFoundError} if the service is not provided
 */
export function inject<T>(service: AbstractType<T>): T {
  const injectable = _injectablesMap.get(service);

  if (injectable == null) {
    throw new ProviderNotFoundError(service.name);
  }

  if ('value' in injectable) {
    return injectable.value as T;
  }

  const value = new injectable.useClass();
  _injectablesMap.set(service, { ...injectable, value });
  return value as T;
}

/**
 * Clear all providers.
 *
 * Used for testing purposes.
 */
export function clearProviders() {
  _injectablesMap.clear();
}

export function Injectable() {
  return function <T extends Type<unknown>>(constructor: T) {
    provide(constructor, { useClass: constructor });
  };
}

const _injectablesMap = new Map<AbstractType<unknown>, { useClass?: Type<unknown>; value?: unknown }>();

export interface ClassProvider<T> {
  useClass: Type<T>;
}

export interface ValueProvider<T> {
  value: T;
}

export class ProviderAlreadyExistsError extends Error {
  override name = ProviderAlreadyExistsError.name;
  constructor(providerName: string) {
    super(`${providerName} has already been provided.`);
  }
}

export class ProviderNotFoundError extends Error {

  override name = ProviderNotFoundError.name;
  constructor(providerName: string) {
    super(`No provider for ${providerName}.`);
  }
}

export type AbstractType<T> = abstract new () => T;
export type Type<T> = new () => T;
export type SameTypeAs<T> = T extends infer U ? U : never;
