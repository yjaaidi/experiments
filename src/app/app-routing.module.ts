import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {
  AngularFireAuthGuardModule,
  canActivate,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { tap } from 'rxjs/operators';

declare var Zone;

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./hello-routing.module').then((m) => m.HelloRoutingModule),
    ...canActivate(() => (source) => {
      console.log(Zone.current);
      return redirectLoggedInTo(['somewhere-else'])(source).pipe(
        tap(() => console.log(Zone.current))
      );
    }),
  },
];

@NgModule({
  imports: [
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
