import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import '../node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import './styles.css';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
