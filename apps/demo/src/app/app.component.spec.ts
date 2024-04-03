import { AppComponent } from './app.component';
import { TestBed } from '@angular/core/testing';

test.each(Array.from(Array(10).keys()))('ok %i', () => {
  const fixture = TestBed.createComponent(AppComponent);
  fixture.autoDetectChanges();

  expect(fixture.nativeElement.querySelector('h2').textContent).toEqual(
    'Burger',
  );
});
