import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  template: `Hello Customer`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: CustomerPageComponent }]),
  ],
  declarations: [CustomerPageComponent],
  exports: [CustomerPageComponent],
})
export class CustomerPageModule {}
