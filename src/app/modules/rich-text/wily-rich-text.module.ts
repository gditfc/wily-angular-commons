import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RichTextComponent} from './rich-text.component';
import {WilyTooltipModule} from '../tooltip/tooltip.module';
import {NgxTiptapModule} from 'ngx-tiptap';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
  declarations: [
    RichTextComponent,
  ],
  imports: [
    CommonModule,
    WilyTooltipModule,
    NgxTiptapModule,
    FormsModule,
    BrowserModule
  ],
  exports: [
    RichTextComponent
  ]
})
export class WilyRichTextModule {
}
