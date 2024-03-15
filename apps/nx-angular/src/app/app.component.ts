import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'nx-angular-root',
  template: `Hello!`
})
export class AppComponent {
  @HostBinding('attr.my-title') title = '';

  constructor(cdr: ChangeDetectorRef) {
    queueMicrotask(() => {
      this.title = 'Angular';
      // @todo remove this to break test.
      cdr.markForCheck();
    });
  }
}
