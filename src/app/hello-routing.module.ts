import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HelloComponent, HelloModule } from './hello.component';

@NgModule({
  imports: [
    HelloModule,
    RouterModule.forChild([
      {
        path: '',
        component: HelloComponent
      }
    ])
  ]
})
export class HelloRoutingModule {

}
