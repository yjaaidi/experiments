import { TestBed } from '@angular/core/testing';
import { expect, test } from '../testing/test';
import { HelloComponent } from './hello.component';

test('says hello', async ({ page, runInBrowser }) => {
  await runInBrowser(async () => {
    TestBed.createComponent(HelloComponent);
  });

  await expect(page.getByRole('heading')).toHaveText('Hello!');
});
