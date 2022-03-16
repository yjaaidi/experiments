import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routes } from '~angular-pages';

@Component({
  template: '<router-outlet></router-outlet>'
})
export class OutletComponent {}

@NgModule({
  declarations: [OutletComponent],
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
