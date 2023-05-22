import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'whiskmate-root',
  imports: [RouterOutlet],
  template: `<router-outlet/>`,
})
export class AppComponent {}
