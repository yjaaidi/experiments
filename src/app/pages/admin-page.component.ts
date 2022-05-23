import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit
} from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-admin-page",
  templateUrl: "./admin-page.component.html",
  styleUrls: ["./admin-page.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: "", component: AdminPageComponent }]),
  ],
  declarations: [AdminPageComponent],
  exports: [AdminPageComponent],
})
export class AdminPageModule {}
