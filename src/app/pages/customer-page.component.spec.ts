import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-dashboard-page',
  template: `Hello Customer`,
})
export class CustomerPageComponent {}

describe(CustomerPageComponent.name, () => {
  it('should be polite', () => {
    const { getContent } = createComponent();
    expect(getContent()).toEqual('Hello Customer');
  });
});

function createComponent() {
  TestBed.configureTestingModule({
    declarations: [CustomerPageComponent],
  });
  const fixture = TestBed.createComponent(CustomerPageComponent);
  return {
    getContent() {
      return fixture.debugElement.nativeElement.textContent;
    },
  };
}
