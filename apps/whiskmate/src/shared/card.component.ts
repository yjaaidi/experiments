import { ChangeDetectionStrategy, Component, Input } from '@angular/core';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-card',
  template: ` @if (pictureUri) {
  <img
    class="picture"
    [alt]="alt"
    [src]="pictureUri"
    />
}
<div class="content">
  <ng-content />
</div>`,
  styles: [
    `
      :host {
        display: block;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        text-align: left;
        width: 300px;
      }

      .picture {
        object-fit: cover;
        height: 250px;
        width: 100%;
      }

      .content {
        margin: 10px;
      }
    `,
  ],
  imports: [],
})
export class Card {
  @Input() alt!: string;
  @Input() pictureUri?: string;
}
