import { Component } from '@angular/core';
import { from, defer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cmp$ = defer(() => import('./a/a.component').then(m => m.AComponent));
}
