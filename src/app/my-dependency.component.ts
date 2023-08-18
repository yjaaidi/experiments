import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'my-dependency',
  template: `the dependency`,
})
export class MyDependencyComponent {}

@NgModule({
  declarations: [MyDependencyComponent],
  exports: [MyDependencyComponent],
})
export class MyDependencyModule {}
