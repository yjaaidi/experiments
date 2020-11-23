import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';

describe('demo', () => {
  beforeEach(() => cy.visit('/'));

  it('should open calendar', () => {
    const datepicker = MatDatepickerInputHarness;
    cy.harness(datepicker).invoke('isCalendarOpen').should('be.false');
    cy.harness(datepicker).invoke('openCalendar');
    cy.harness(datepicker).invoke('isCalendarOpen').should('be.true');
  });
});
