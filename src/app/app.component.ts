import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyStandaloneComponent } from './my-standalone.component';
import { MyNonStandaloneModule } from './my-non-standalone.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <my-standalone />
    <my-non-standalone />
  `,
  imports: [MyStandaloneComponent, MyNonStandaloneModule],
})
export class AppComponent {}
