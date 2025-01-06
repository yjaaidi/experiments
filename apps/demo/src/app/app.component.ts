import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: ` @if(isGreeting()) {
    <h1>Welcome!</h1>
    <button (click)="isGreeting.set(false)">Quit</button>
    } @else {
    <h1>Bye!</h1>
    }`,
})
export class AppComponent {
  isGreeting = signal(true);
}
