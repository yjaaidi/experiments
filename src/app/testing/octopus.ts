import type { Type, Provider } from '@angular/core';

export interface Platform {
  describe(name: string, fn: () => void): void;
  it(name: string, fn: () => Promise<void> | void): void;
  test(name: string, fn: () => Promise<void> | void): void;

  find<ELEMENT extends Element>(selector: string): Promise<ELEMENT>;
  findAll<ELEMENT extends Element>(selector: string): Promise<ELEMENT[]>;
  mount<T>(componentType: Type<T>, options?: MountOptions): Promise<void>;

  click(element: Element): Promise<void>;

  expect<T>(value: T): {
    toEqual(expected: T): void;
  };
}

export interface MountOptions {
  providers?: Provider[];
  imports?: Type<unknown>[];
}

class Octopus {
  private _platform?: Platform;

  setPlatform(platform: Platform) {
    this._platform = platform;
  }

  click = this._wrap('click');
  describe = this._wrap('describe');
  it = this._wrap('it');
  test = this._wrap('test');

  find = this._wrap('find');
  findAll = this._wrap('findAll');
  mount = this._wrap('mount');

  expect = this._wrap('expect');

  private _getPlatform() {
    if (this._platform == null) {
      throw new Error('Platform is not set');
    }
    return this._platform;
  }

  private _wrap<FUNCTION_NAME extends keyof Platform>(
    name: FUNCTION_NAME
  ): Platform[FUNCTION_NAME] {
    return (...args: unknown[]) => {
      const platform = this._getPlatform();
      return (platform[name] as any)(...args);
    };
  }
}

export const octopus = new Octopus();
