import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DoCheck, NgModule } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'mc-hello',
  template: `
    <button (click)="doIt()">ACTION</button>
  `
})
export class HelloComponent implements DoCheck {

  ngDoCheck() {
    console.log(`check hello`);
  }

  doIt() {
    console.log('👋');
  }
}

@NgModule({
  declarations: [HelloComponent],
  exports: [HelloComponent],
  imports: [CommonModule, ReactiveFormsModule]
})
export class HelloModule {
}
