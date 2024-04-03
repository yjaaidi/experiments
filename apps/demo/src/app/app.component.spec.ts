import { AppComponent } from './app.component';
import { TestBed } from '@angular/core/testing';

/* Can't use `test.each` with Web Test Runner,
 * so let's fallback to a simple for loop. */
for (let i = 0; i < 10; i++) {
  it(`ok ${i}`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();

    expect(fixture.nativeElement.querySelector('h2').textContent).toEqual(
      'Burger',
    );
  });
}
