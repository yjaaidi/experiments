import {
  MatCalendarHarness,
  MatDatepickerInputHarness,
} from '@angular/material/datepicker/testing';
import { getAllHarnesses, getHarness } from '../support/cypress-harness';
import { mount } from '../support/mount';

describe('demo', () => {
  const datepicker = MatDatepickerInputHarness;

  beforeEach(() => {
    cy.clock(new Date(2020, 0, 1));
    // mount();
    cy.visit('/');
  });

  it('should open calendar', () => {
    getHarness(datepicker).invoke('isCalendarOpen').should('be.false');
    getHarness(datepicker).invoke('openCalendar');
    getHarness(datepicker).invoke('isCalendarOpen').should('be.true');
  });

  it('should set date', () => {
    getHarness(datepicker).invoke('setValue', '1/1/2020');
    getHarness(datepicker).invoke('openCalendar');
    getHarness(datepicker).invoke('getCalendar').invoke('next');
    getHarness(datepicker)
      .invoke('getCalendar')
      .invoke('selectCell', { text: '10' });
    getHarness(datepicker).invoke('getValue').should('equal', '2/10/2020');
    getAllHarnesses(MatCalendarHarness).should('be.empty'); // `isCalendarOpen` is not working due to remaining `aria-owns` attribute.
  });
});
