import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChange } from '@angular/core';
import { filter, map, timer } from 'rxjs';
import {
  getInputChange,
  injectLifecycleHooks,
  LinkLifecycleHooks,
  provideLifecycleHooks,
} from './lifecycle-hooks';

@LinkLifecycleHooks()
@Component({
  standalone: true,
  selector: 'mc-title',
  imports: [CommonModule],
  template: `<h1 [style.fontSize.em]="size === 'large' ? 2 : 1">
      {{ title }}
    </h1>
    <hr />
    <ul>
      <li *ngFor="let log of logs">{{ log }}</li>
    </ul>`,
  providers: [provideLifecycleHooks()],
})
export class TitleComponent {
  @Input() title?: string | null;
  @Input() size: 'medium' | 'large' = 'medium';

  hooks = injectLifecycleHooks();

  sizeChange$ = getInputChange(this.hooks, 'size');
  titleChange$ = getInputChange(this.hooks, 'title');

  logs: string[] = [];

  constructor() {
    this.hooks.init$.subscribe(() => this._log(`🐣 Init`));
    this.hooks.destroy$.subscribe(() => this._log(`💥 Destroy`));

    this.sizeChange$.subscribe((change) => this._logChange('size', change));
    this.titleChange$.subscribe((change) => this._logChange('title', change));
  }

  private _logChange(inputName: string, change: SimpleChange) {
    this._log(
      `ℹ️ ${inputName} changed${
        change.firstChange ? ' for the first time' : ''
      }: "${change.previousValue}" => "${change.currentValue}"`
    );
  }

  private _log(message: string) {
    this.logs = [...this.logs, message].slice(-30);
  }
}

@Component({
  standalone: true,
  selector: 'mc-app',
  imports: [CommonModule, TitleComponent],
  template: `
    <button (click)="isDisplayed = !isDisplayed">TOGGLE</button>
    <mc-title
      *ngIf="isDisplayed"
      [title]="now$ | async | date: 'mediumTime'"
      size="large"
    ></mc-title>
  `,
})
export class AppComponent {
  isDisplayed = true;
  now$ = timer(0, 100).pipe(map(() => new Date()));
}
