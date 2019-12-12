import { Component, NgModule } from '@angular/core';
import { BModule } from '../b/b.component';

@Component({
  selector: 'app-a',
  templateUrl: './a.component.html',
  styleUrls: ['./a.component.css']
})
export class AComponent {
}

@NgModule({
  declarations: [AComponent],
  imports: [BModule]
})
export class AModule {}
