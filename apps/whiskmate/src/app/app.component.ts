import { Component } from '@angular/core';

@Component({
  selector: 'wm-root',
  template: `
    <h1>Welcome to Whiskmate</h1>
    <wm-meal-search></wm-meal-search>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `,
  ],
})
export class AppComponent {}
