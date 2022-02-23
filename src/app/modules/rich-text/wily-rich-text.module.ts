import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RichTextComponent} from './rich-text.component';
import {WilyTooltipModule} from '../tooltip/tooltip.module';
import {NgxTiptapModule} from 'ngx-tiptap';
import {RichTextV2Component} from './rich-text-v2/rich-text-v2.component';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
  declarations: [
    RichTextComponent,
    RichTextV2Component
  ],
  imports: [
    CommonModule,
    WilyTooltipModule,
    NgxTiptapModule,
    FormsModule,
    BrowserModule
  ],
  exports: [
    RichTextComponent,
    RichTextV2Component
  ]
})
export class WilyRichTextModule {
}
