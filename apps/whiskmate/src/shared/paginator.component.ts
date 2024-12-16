import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
  standalone: false,
})
export class Paginator {
  @Input({ required: true }) itemsPerPage!: number;
  @Input({ required: true }) offset!: number;
  @Input({ required: true }) total!: number;
  @Output() offsetChange = new EventEmitter<number>();

  getNextOffset(): number | null {
    const nextOffset = this.offset + this.itemsPerPage;
    return nextOffset < this.total ? nextOffset : null;
  }

  getPreviousOffset(): number | null {
    const previousOffset = this.offset - this.itemsPerPage;
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

@NgModule({
  declarations: [Paginator],
  imports: [CommonModule, MatButton],
  exports: [Paginator],
})
export class PaginatorModule {}
