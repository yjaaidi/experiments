import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarChipComponent } from './toolbar-chip.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-toolbar',
  imports: [MatToolbarModule, ToolbarChipComponent],
  template: `
    <mat-toolbar color="primary">
      <h1>{{ title }}</h1>
      <div class="spacer"></div>
      <wm-toolbar-chip>🛒</wm-toolbar-chip>
    </mat-toolbar>
  `,
  styles: [
    `
      .spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class ToolbarComponent {
  @Input({ required: true }) title!: string;
}
