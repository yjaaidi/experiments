import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button (click)="click.emit('🙏 thanks for clicking ❤️')">
    {{ label() }}
  </button>`,
})
export class ButtonComponent {
  label = input('CLICK ME');
  click = output<string>();
}
