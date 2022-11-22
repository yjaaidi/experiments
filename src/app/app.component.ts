import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<button (click)="decrement()">-</button><span>{{ i }}</span
    ><button (click)="increment()">+</button>`,
})
export class AppComponent {
  i = 0;

  decrement() {
    --this.i;
  }

  increment() {
    ++this.i;
  }
}
