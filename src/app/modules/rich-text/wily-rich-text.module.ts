import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RichTextComponent} from './rich-text.component';

@NgModule({
  declarations: [
    RichTextComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RichTextComponent
  ]
})
export class WilyRichTextModule { }
