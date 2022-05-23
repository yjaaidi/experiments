import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit
} from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-dashboard-page",
  template: `Hello Dashboard`,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: "", component: DashboardPageComponent }]),
  ],
  declarations: [DashboardPageComponent],
  exports: [DashboardPageComponent],
})
export class DashboardPageModule {}
