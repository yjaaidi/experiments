import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'whiskmate-root',
  template: `{{title}}`,
})
export class AppComponent {
  title = 'whiskmate';
}
