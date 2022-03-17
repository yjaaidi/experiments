import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import OutletComponent from '../pages/__products';
import { routes } from '~angular-pages';

@NgModule({
  declarations: [OutletComponent],
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
