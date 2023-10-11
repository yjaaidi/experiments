import { Component } from '@angular/core';
import { Link, NavComponent } from '@whiskmate/shared/ui';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'wm-root',
  imports: [NavComponent, RouterOutlet],
  template: `
    <wm-nav title="Suggestions" [links]="links">
      <router-outlet />
    </wm-nav>
  `,
})
export class AppComponent {
  links: Link[] = [
    {
      route: ['/suggestions'],
      name: 'Suggestions',
    },
  ];
}
