import {
  MatCalendarCellHarness,
  MatCalendarHarness,
  MatDatepickerInputHarness,
} from '@angular/material/datepicker/testing';

describe('demo', () => {
  beforeEach(() => {
    cy.clock(new Date(2020, 0, 1));
    cy.visit('/');
  });

  it('should open calendar', () => {
    const datepicker = MatDatepickerInputHarness;
    const calendar = MatCalendarHarness;
    const cell = MatCalendarCellHarness;
    cy.harness(datepicker).invoke('setValue', '1/1/2020');
    cy.harness(datepicker).invoke('isCalendarOpen').should('be.false');
    cy.harness(datepicker).invoke('openCalendar');
    cy.harness(datepicker).invoke('isCalendarOpen').should('be.true');
    cy.harness(calendar).invoke('next');
    cy.harness(cell).invoke('select');
    cy.harness(datepicker).invoke('getValue').should('equal', '2/1/2020');
  });
});
