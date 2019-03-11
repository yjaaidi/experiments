import { BrowserModule } from '@angular/platform-browser';
import { Component, Input, Pipe, Directive, ElementRef, OnInit, NgModule } from '@angular/core';
import { ngMarkup as ngMarkup } from './ng-markup';

@Directive({
  selector: '[wt-red]'
})
export class Red implements OnInit {
  constructor(private _elementRef: ElementRef) {
  }

  ngOnInit() {
    this._elementRef.nativeElement.style.backgroundColor = 'red';
  }

}

@Pipe({
  name: 'up'
})
export class Up {
  transform(value) {
    return value.toUpperCase()
  }
}

@Component({
  selector: 'wt-greetings',
  template: ngMarkup`<h1 ${Red}>Hi {{ name | ${Up} }}</h1>`
})
export class Greetings {
  @Input() name: string;
}

@Component({
  selector: 'wt-root',
  template: ngMarkup`
    <${Greetings} name="foo"></${Greetings}>
    <${Greetings} name="john"></${Greetings}>
    `,
})
export class AppComponent {
}


@NgModule({
  declarations: [
    AppComponent,
    Greetings,
    Red,
    Up
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
