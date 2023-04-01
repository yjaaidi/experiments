import { computed, effect } from '@angular/core';
import { ApplicationConfig, NgZone, ɵNoopNgZone, signal } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideZoneless(),
  ],
};

function provideZoneless() {
  return { provide: NgZone, useClass: ɵNoopNgZone };
}
