import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cmp;

  constructor() {
  }

  async ngOnInit() {
    this.cmp = await import('./a/a.component').then(m => m.AComponent);
  }

}
