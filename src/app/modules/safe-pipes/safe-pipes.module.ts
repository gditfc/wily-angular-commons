import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SafeStylePipe} from './safe-style.pipe';
import {SafeHtmlPipe} from './safe-html.pipe';

@NgModule({
  declarations: [
    SafeHtmlPipe,
    SafeStylePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SafeHtmlPipe,
    SafeStylePipe
  ]
})
export class SafePipesModule {
}
