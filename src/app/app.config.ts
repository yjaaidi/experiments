import { ApplicationConfig, NgZone, ɵNoopNgZone } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // { provide: NgZone, useClass: ɵNoopNgZone }
  ],
};
