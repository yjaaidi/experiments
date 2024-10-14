import { TestBed } from '@angular/core/testing';
import { expect, test } from '../testing/test-bear';
import { HelloComponent } from './hello.component';

test('says hello', async ({ page, browserStep, step }) => {
  await browserStep(async () => {
    TestBed.createComponent(HelloComponent)
  });

  await step(async () => {
    await expect(page.getByRole('heading')).toHaveText('Hello!');
  });
});
