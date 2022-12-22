/// <reference types="cypress" />
import './commands';

import { mount } from 'cypress/angular';
import { octopus, Platform } from '../../src/app/testing/octopus';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);

const testWrapper: Platform['test'] = (
  name: string,
  fn: () => Promise<void>
) => {
  return test(name, fn);
};

octopus.setPlatform({
  describe,
  it: testWrapper,
  test: testWrapper,
  find(selector) {
    return new Promise((resolve) =>
      cy.get(selector).then((jqEl) => resolve(jqEl.get(0) as any))
    );
  },
  findAll(selector) {
    return new Promise((resolve) =>
      cy.get(selector).then((jqEl) => resolve(jqEl.toArray() as any[]))
    );
  },
  mount(componentType, options) {
    return new Promise((resolve) =>
      cy.mount(componentType, options).then(() => resolve())
    );
  },
  expect: (value) => {
    return {
      toEqual: (expected) => {
        expect(value).to.equal(expected);
      },
    };
  },
});
