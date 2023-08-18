import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MyDependencyModule } from './my-dependency.component';
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'my-standalone',
  template: `<my-dependency />`,
  imports: [MyDependencyModule],
})
export class MyStandaloneComponent {}
