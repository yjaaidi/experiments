import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarChipComponent } from './toolbar-chip.component';
import { RouterLink } from '@angular/router';
import { Cart } from '../cart/cart.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-toolbar',
  imports: [MatToolbarModule, ToolbarChipComponent, RouterLink],
  template: `
    <mat-toolbar color="primary">
      <a class="link" routerLink="/"
        ><h1>{{ title }}</h1></a
      >
      <div class="spacer"></div>
      <wm-toolbar-chip>🛒 {{ cart.count() }}</wm-toolbar-chip>
    </mat-toolbar>
  `,
  styles: [
    `
      .link {
        color: white;
        text-decoration: none;
      }
      .spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class ToolbarComponent {
  @Input({ required: true }) title!: string;

  cart = inject(Cart);
}
