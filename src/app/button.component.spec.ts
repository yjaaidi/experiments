import { TestBed } from '@angular/core/testing';
import { expect, test } from '../testing/test';
import { ButtonComponent } from './button.component';

test('forward properties to browser', async ({ page, runInBrowser }) => {
  await runInBrowser(
    async ({ data: { label } }) => {
      const fixture = TestBed.createComponent(ButtonComponent);
      fixture.componentRef.setInput('label', label);
    },
    {
      data: { label: 'MY LABEL' },
    },
  );

  await expect(page.getByRole('button')).toHaveText('MY LABEL');
});

test('expose callbacks to browser', async ({ page, runInBrowser }) => {
  let clickMessages: string[] = [];
  await runInBrowser(
    async ({ callbacks: { onClick } }) => {
      const fixture = TestBed.createComponent(ButtonComponent);
      fixture.componentInstance.click.subscribe(onClick);
    },
    {
      callbacks: {
        onClick: (message: string) => {
          clickMessages.push(message);
        },
      },
    },
  );

  await page.getByRole('button').click();
  await page.getByRole('button').click();

  expect(clickMessages).toHaveLength(2);
  expect(clickMessages[1]).toBe('🙏 thanks for clicking ❤️');
});
