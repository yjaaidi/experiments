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

import { ComponentHarness, HarnessQuery } from '@angular/cdk/testing';
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
