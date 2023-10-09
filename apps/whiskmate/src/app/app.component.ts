import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavComponent } from '@whiskmate/shared-ui';

@Component({
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  selector: 'wm-app',
  template: `
    <wm-nav [links]="links" title="👨🏻‍🍳 Whiskmate">
      <router-outlet />
    </wm-nav>
  `,
})
export class AppComponent {
  links = [
    { name: 'Search', route: ['/search'], queryParams: { country: 'fr' } },
    { name: 'My Meals', route: ['/meals'] },
  ];
}
