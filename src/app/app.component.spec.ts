import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';

describe(AppComponent.name, () => {
  it('should pass 42 to child component', () => {
    const { getCounterValue } = createComponent();

    expect(getCounterValue()).toEqual(42);
  });

  function createComponent() {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    return {
      getCounterValue() {
        return fixture.debugElement.query(By.css('mc-counter')).properties[
          'value'
        ];
      },
    };
  }
});
