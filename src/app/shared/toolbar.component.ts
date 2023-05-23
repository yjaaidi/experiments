import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-toolbar',
  imports: [MatToolbarModule],
  template: `
    <mat-toolbar color="primary">
      <h1>{{ title }}</h1>
      <div class="spacer"></div>
      <ng-content/>
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
