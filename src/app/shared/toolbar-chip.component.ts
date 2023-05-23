import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-toolbar-chip',
  template: `<ng-content/>`,
  styles: [
    `
      :host {
        background: white;
        border-radius: 25px 10px;
        color: var(--primary-color);
        padding: 5px 20px;
      }
    `,
  ],
})
export class ToolbarChipComponent {}
