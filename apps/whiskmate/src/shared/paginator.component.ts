import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
  output
} from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-paginator',
  template: `
    <button
      [disabled]="getPreviousOffset() === null"
      (click)="goToPrevious()"
      mat-button
    >
      Previous
    </button>
    <button
      [disabled]="getNextOffset() === null"
      (click)="goToNext()"
      mat-button
    >
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
  imports: [MatButton],
})
export class Paginator {
  readonly itemsPerPage = input.required<number>();
  @Input({ required: true }) offset!: number;
  readonly total = input.required<number>();
  readonly offsetChange = output<number>();

  getNextOffset(): number | null {
    const nextOffset = this.offset + this.itemsPerPage();
    return nextOffset < this.total() ? nextOffset : null;
  }

  getPreviousOffset(): number | null {
    const previousOffset = this.offset - this.itemsPerPage();
    return previousOffset >= 0 ? previousOffset : null;
  }

  goToNext() {
    this._setOffset(this.getNextOffset());
  }

  goToPrevious() {
    this._setOffset(this.getPreviousOffset());
  }

  private _setOffset(offset: number | null) {
    if (offset === null) {
      return;
    }
    this.offset = offset;
    this.offsetChange.emit(offset);
  }
}
