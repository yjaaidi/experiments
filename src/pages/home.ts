import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  template: ` <h1>Homes</h1> `
})
export  class HomePageComponent {}

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: HomePageComponent }
    ])
  ],
  declarations: [
    HomePageComponent
  ]
})
export class HomePageComponentModule {}

export default HomePageComponentModule;