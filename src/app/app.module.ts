import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AppComponent,
  DynamicFieldComponent,
  DynamicFormComponent,
  NumberFieldComponent,
  TextFieldComponent
} from './app.component';
import { HelloModule } from './hello.component';

@NgModule({
  declarations: [AppComponent, DynamicFormComponent, DynamicFieldComponent, NumberFieldComponent, TextFieldComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
