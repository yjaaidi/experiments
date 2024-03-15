import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe(AppComponent.name, () => {
  it('should render title', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();

    await flushMicrotasks();

    expect(fixture.nativeElement.attributes['my-title'].value).toEqual(
      'Angular'
    );
  });
});

async function flushMicrotasks() {
  return;
}
