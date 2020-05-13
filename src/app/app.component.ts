import { ChangeDetectionStrategy, Component, DoCheck } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-root',
  template: `
    <fieldset>
      <legend>Hello</legend>
      <mc-hello></mc-hello>
    </fieldset>

    <fieldset>
      <legend>Routed</legend>
      <router-outlet></router-outlet>
    </fieldset>

    <hr />

    <div>User: {{ user$ | async | json }}</div>
  `,
})
export class AppComponent implements DoCheck {
  user$ = this.auth.user;

  constructor(private auth: AngularFireAuth) {}

  ngDoCheck() {
    console.log('check app');
  }
}
