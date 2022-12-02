import { DebugElement } from '@angular/core';

export function getDebugElement(selector: string) {
  const nativeEl = document.querySelector(selector);
  if (nativeEl == null) {
    throw new Error(`Element "${selector}" not found.`);
  }
  return new DebugElement(nativeEl);
}

export function getAllDebugElements(selector: string): Array<DebugElement> {
  return Array.from(document.querySelectorAll(selector)).map(
    (el) => new DebugElement(el)
  );
}
