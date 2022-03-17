import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products-not-found',
  template: ` <h1>Not Found</h1> `
})
export class NotFoundPageComponent {}

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: NotFoundPageComponent}
    ])
  ],
  declarations: [NotFoundPageComponent]
})
export class NotFoundPageComponentModule {}

export default NotFoundPageComponentModule;