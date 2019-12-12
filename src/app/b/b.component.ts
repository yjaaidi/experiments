import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-b',
  templateUrl: './b.component.html',
  styleUrls: ['./b.component.css']
})
export class BComponent {
}

@NgModule({
  declarations: [BComponent],
  exports: [BComponent]
})
export class BModule {}
