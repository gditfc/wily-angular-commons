import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {JsonInterceptor} from '../../shared/interceptors/json.interceptor';
import {ThemingComponent} from './components/theming.component';
import {ThemingService} from './services/theming.service';
import {ColorPickerModule, TabViewModule} from 'primeng/primeng';
import {LocalStorageService} from '../../shared/services/local-storage.service';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ColorPickerModule,
    TabViewModule
  ],
  declarations: [
    ThemingComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JsonInterceptor,
      multi: true
    },
    ThemingService,
    LocalStorageService
  ],
  exports: [
    ThemingComponent
  ]
})
export class ThemingModule {
}
