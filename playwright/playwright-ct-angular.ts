import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

declare global {
  function pwMount(
    cmpType: Type<unknown>,
    args: {
      props?: Record<string, unknown>;
      on?: Record<string, (...args: unknown[]) => void>;
    },
  ): Promise<void>;
}

globalThis.pwMount = (async (cmpType, { props = {}, on = {} }) => {
  const fixture = TestBed.createComponent(cmpType);

  for (const [prop, value] of Object.entries(props)) {
    fixture.componentRef.setInput(prop, value);
  }

  for (const [event, handler] of Object.entries(on)) {
    (fixture.componentInstance as any)[event].subscribe(handler);
  }
}) satisfies typeof pwMount;
