// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace

import {
  ComponentHarness,
  HarnessPredicate,
  HarnessQuery,
} from '@angular/cdk/testing';
import 'cypress-pipe';
import { CypressHarnessEnvironment } from './cypress-harness';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      login(email: string, password: string): void;
      harness<T extends ComponentHarness>(query: HarnessQuery<T>): Chainable<T>;
    }
  }
}
//
// -- This is a parent command --
Cypress.Commands.add(
  'harness',
  <T extends ComponentHarness>(query: HarnessQuery<T>) => {
    /* @hack recreate `HarnessPredicate` because the one referenced in tests
     * is not the same as here due to the way Cypress builds the tests
     * Otherwise, the `isinstanceof` call here is broken: https://github.com/angular/components/blob/5bfe312b5ee247109ed5d35cc07660fca04db0fe/src/cdk/testing/harness-environment.ts#L220. */
    if ('harnessType' in query) {
      const originalQuery = query;
      query = new HarnessPredicate(originalQuery.harnessType, {});
      Object.assign(query, originalQuery);
    }

    /* Create a local variable so `pipe` can log name. */
    const getHarness = (body) =>
      new CypressHarnessEnvironment(body).getHarness(query);

    return cy.get('body').pipe(getHarness);
  }
);

//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
