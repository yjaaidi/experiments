import { DebugElement, NO_ERRORS_SCHEMA, Type } from '@angular/core';
import {
  render,
  RenderComponentOptions,
  RenderResult,
} from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';

export async function renderShallow<ComponentType>(
  component: Type<ComponentType>,
  renderOptions?: RenderShallowComponentOptions<ComponentType>
): Promise<RenderShallowResult<ComponentType>> {
  TestBed.overrideComponent(component, {
    set: {
      imports: renderOptions?.componentImports ?? [],
      schemas: renderOptions?.schemas ?? [NO_ERRORS_SCHEMA],
    },
  });

  const result = await render(component, {
    ...renderOptions,
  });

  return {
    ...result,
    getDebugElement(selector) {
      return _getDebugElement(result.container, selector);
    },
    getAllDebugElements(selector) {
      return _getAllDebugElements(result.container, selector);
    },
  };
}

export interface RenderShallowComponentOptions<ComponentType>
  extends RenderComponentOptions<ComponentType> {
  componentImports?: Type<unknown>[];
}

export interface RenderShallowResult<ComponentType>
  extends RenderResult<ComponentType, ComponentType> {
  getDebugElement(selector: string): DebugElement;

  getAllDebugElements(selector: string): DebugElement[];
}

function _getDebugElement(container: Element, selector: string) {
  const nativeEl = document.querySelector(selector);
  if (nativeEl == null) {
    throw new Error(`Element "${selector}" not found.`);
  }
  return new DebugElement(nativeEl);
}

function _getAllDebugElements(
  container: Element,
  selector: string
): Array<DebugElement> {
  return Array.from(document.querySelectorAll(selector)).map(
    (el) => new DebugElement(el)
  );
}
