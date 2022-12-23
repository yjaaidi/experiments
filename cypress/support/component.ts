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
  async find(selector) {
    const jqEl = await cy.now('get', selector);
    return jqEl.get(0);
  },
  findAll(selector) {
    const anyCy: any = cy;
    const jqEl = anyCy.queryFns['get'].apply(
      anyCy.state('current') ?? { set() {} },
      [selector]
    )();
    return jqEl.toArray();
  },
  mount(componentType, options) {
    return cy.now('mount', componentType, options) as any;
  },
  expect: (value) => {
    return {
      toEqual: (expected) => {
        expect(value).to.equal(expected);
      },
    };
  },
});
