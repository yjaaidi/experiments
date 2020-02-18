import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, NgModule, Pipe, PipeTransform, ɵdetectChanges, ɵmarkDirty } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Pipe({
  name: 'push',
  pure: false
})
export class PushPipe extends AsyncPipe {

  lastSource;
  source;

  constructor(private cdr: ChangeDetectorRef) {
    super(cdr);
  }

  transform(source) {

    if (this.lastSource !== source) {
      this.lastSource = source;
      this.source = source.pipe(tap(() => ɵmarkDirty((this.cdr as any).context)));
    }

    return super.transform(this.source);

  }

}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  subject$ = new BehaviorSubject(0);

  x$ = this.subject$.pipe(tap(console.log));

  increment() {
    this.subject$.next(this.subject$.value + 1);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    PushPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
