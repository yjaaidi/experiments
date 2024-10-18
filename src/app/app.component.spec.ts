import { TestBed } from '@angular/core/testing';
import { expect, test } from '../testing/test';
import { AppComponent } from './app.component';

test('should search recipes without filtering', async ({
  page,
  runInBrowser,
}) => {
  await runInBrowser(async () => {
    // TestBed.createComponent(AppComponent);
  });

  await expect(page.getByRole('listitem')).toHaveText(['Burger', 'Salad']);
});
