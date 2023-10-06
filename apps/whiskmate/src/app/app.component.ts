import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'wm-app',
  template: ` <router-outlet /> `,
})
export class AppComponent {}
