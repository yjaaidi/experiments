import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button (click)="click.emit()">{{ label() }}</button>`,
})
export class ButtonComponent {
  label = input.required();
  click = output<void>();
}
