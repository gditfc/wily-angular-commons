import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginatorComponent} from './paginator.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {OverlayPanelModule} from 'primeng/overlaypanel';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    OverlayPanelModule
  ],
  declarations: [
    PaginatorComponent
  ],
  providers: [
  ],
  exports: [
  PaginatorComponent
  ]
})
export class WilyPaginatorModule {
}
