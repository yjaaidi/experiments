import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-meals',
  template: `🚧 meals`,
})
export class MealsComponent {}

export default MealsComponent;
