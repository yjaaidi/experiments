import '@percy/cypress';
import { mount } from 'cypress/angular';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      getByDataRole(role: string): Chainable<JQuery<HTMLElement>>;
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('getByDataRole', (role) => {
  return cy.get(`[data-role="${role}"]`);
});

Cypress.Commands.add('mount', mount);
