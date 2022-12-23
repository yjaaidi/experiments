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
    return runQuery('get', selector).get(0);
  },
  findAll(selector) {
    return runQuery('get', selector).toArray();
  },

  async click(element) {
    // @todo use cypress command
    // runCommand('click', Cypress.$(element), { $el: Cypress.$(element) });
    (element as any).click();
  },

  async mount(componentType, options) {
    await runCommand('mount', componentType, options);
  },
  expect: (value) => {
    return {
      toEqual: (expected) => {
        expect(value).to.equal(expected);
      },
    };
  },
});

function runCommand(command: string, ...args: any[]) {
  return cy.now(command, ...args) as Promise<unknown>;
}

function runQuery(query: string, ...args: any[]) {
  const anyCy: any = cy;
  return anyCy.queryFns[query].apply(
    anyCy.state('current') ?? { set() {} },
    args
  )();
}
