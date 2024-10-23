import { TestBed } from '@angular/core/testing';
import { expect, test } from '../testing/test';
import { AppComponent } from './app.component';

test('use provided label', async ({ page, runInBrowser }) => {
  await runInBrowser(
    async ({ label }) => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.componentRef.setInput('label', label);
    },
    { label: 'MY LABEL' },
  );

  await expect(page.getByRole('button')).toHaveText('MY LABEL');
});
