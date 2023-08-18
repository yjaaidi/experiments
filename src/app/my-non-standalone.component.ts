import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MyDependencyModule } from './my-dependency.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'my-non-standalone',
  template: `<my-dependency />`,
})
export class MyNonStandaloneComponent {}

@NgModule({
  declarations: [MyNonStandaloneComponent],
  exports: [MyNonStandaloneComponent],
  imports: [MyDependencyModule],
})
export class MyNonStandaloneModule {}
