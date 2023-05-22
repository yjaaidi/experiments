import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'whiskmate-page',
  template: `
  <h1>{{ title }}</h1>
  <ng-content/>
  `,
})
export class PageComponent {
  @Input({ required: true }) title!: string;
}
