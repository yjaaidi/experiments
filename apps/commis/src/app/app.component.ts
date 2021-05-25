import { Component } from '@angular/core';

@Component({
  selector: 'co-root',
  template: `
    <h1>Welcome to Commis</h1>
    <co-meal-search></co-meal-search>
  `,
  styles: [
    `:host {
      display: flex;
      flex-direction: column;
      align-items: center;
    }`
  ]
})
export class AppComponent {}
