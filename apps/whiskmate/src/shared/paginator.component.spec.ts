import { Paginator } from './paginator.component';
import { fireEvent, render, screen } from '@testing-library/angular';

describe(Paginator.name, () => {
  it('should increment offset by itemsPerPage when clicking next page', async () => {
    const { clickNext, getLastEmittedOffset } = await renderComponent();

    await clickNext();

    expect(getLastEmittedOffset()).toBe(10);
  });

  it('should decrement offset by itemsPerPage when clicking previous page', async () => {
    const { clickNext, clickPrevious, getLastEmittedOffset } =
      await renderComponent();

    await clickNext();
    await clickPrevious();

    expect(getLastEmittedOffset()).toBe(0);
  });

  it('should disable previous button on first page', async () => {
    await renderComponent();

    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
  });

  it('should disable next button on last page', async () => {
    const { clickNext } = await renderComponent();

    await clickNext();

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  async function renderComponent() {
    let offset: number;
    const { fixture } = await render(Paginator, {
      inputs: {
        itemsPerPage: 10,
        offset: 0,
        total: 17,
      },
      on: {
        offsetChange(o) {
          offset = o;
        },
      },
    });

    return {
      async clickNext() {
        fireEvent.click(screen.getByRole('button', { name: /next/i }));
        await fixture.whenStable();
      },
      async clickPrevious() {
        fireEvent.click(screen.getByRole('button', { name: /previous/i }));
        await fixture.whenStable();
      },
      getLastEmittedOffset() {
        return offset;
      },
    };
  }
});