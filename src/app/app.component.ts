import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  count$ = new BehaviorSubject(100);
  cubeInfoList$;

  constructor() {
    this.cubeInfoList$ = this.count$.pipe(map(count => Array(count).fill(null)));
  }

  setCount(count) {
    this.count$.next(count);
  }
}
