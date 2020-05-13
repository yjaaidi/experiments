import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloModule } from './hello.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AngularFireModule.initializeApp({
      apiKey: 'xxx'
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HelloModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
