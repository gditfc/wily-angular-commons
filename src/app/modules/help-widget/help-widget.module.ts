import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HelpDataService, HelpWidgetComponent} from './help-widget.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {JsonInterceptor} from '../../shared/interceptors/json.interceptor';
import {WilyDialogModule} from '../wily-dialog/wily-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    WilyDialogModule
  ],
  declarations: [
    HelpWidgetComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JsonInterceptor,
      multi: true
    },
    HelpDataService
  ],
  exports: [
    HelpWidgetComponent
  ]
})
export class HelpWidgetModule {
}
