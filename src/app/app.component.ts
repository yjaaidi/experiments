import { Component, NgModule, ɵmarkDirty } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  subject$ = new BehaviorSubject(0);

  x$ = this.subject$.pipe(
    tap(() => ɵmarkDirty(this))
  );

  increment() {
    this.subject$.next(this.subject$.value + 1);
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
