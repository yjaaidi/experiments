import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { timer } from 'rxjs';
import { Reactive, watchAsync } from './reactor';


@Reactive()
@Component({
  selector: 'app-root',
  template: `
    <h1>{{ value }}</h1>
    {{ log() }}
  `,
})
export class AppComponent {
  value = 0;

  constructor() {
    timer(0, 100).subscribe((value) => {
      this.value = 0;
      this.value = Math.round(value / 10);
    });

    watchAsync(this, 'value').subscribe((value) => console.log(value));
  }

  log() {
    console.count('change detection');
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
