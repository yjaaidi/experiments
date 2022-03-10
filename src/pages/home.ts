import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-home',
  template: ` <h1>Homes</h1> `
})
export class HomePageComponent {}

@NgModule({
  declarations: [HomePageComponent]
})
export default class HomePageComponentModule {}