import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-welcome',
  template: ` <a class="go" routerLink="/search">Go!</a> `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        background: var(--primary-color);
      }

      .go {
        color: white;
        font-size: 15em;
        text-decoration: none;
      }
    `,
  ],
  imports: [RouterLink],
})
export class WelcomeComponent {}

export default WelcomeComponent;
