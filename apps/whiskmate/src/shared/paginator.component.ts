import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-paginator',
  imports: [MatButton],
  template: `
    <button
      [disabled]="previousOffset() === null"
      (click)="goToPrevious()"
      mat-button
    >
      Previous
    </button>
    <button [disabled]="nextOffset() === null" (click)="goToNext()" mat-button>
      Next
    </button>
  `,
  styles: [
    `
      :host {
        display: flex;
        gap: 2em;
        justify-content: center;
      }
    `,
  ],
})
export class Paginator {
  readonly itemsPerPage = input.required<number>();
  readonly offset = model.required<number>();
  readonly total = input.required<number>();

  nextOffset = computed(() => {
    const nextOffset = this.offset() + this.itemsPerPage();
    return nextOffset < this.total() ? nextOffset : null;
  });

  previousOffset = computed(() => {
    const previousOffset = this.offset() - this.itemsPerPage();
    return previousOffset >= 0 ? previousOffset : null;
  });

  goToNext() {
    this._setOffset(this.nextOffset());
  }

  goToPrevious() {
    this._setOffset(this.previousOffset());
  }

  private _setOffset(offset: number | null) {
    if (offset === null) {
      return;
    }
    this.offset.set(offset);
  }
}
