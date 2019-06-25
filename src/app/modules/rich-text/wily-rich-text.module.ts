import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditorModule} from 'primeng/editor';
import {RichTextComponent} from './rich-text.component';

@NgModule({
  declarations: [
    RichTextComponent
  ],
  imports: [
    CommonModule,
    EditorModule
  ],
  exports: [
    RichTextComponent
  ]
})
export class WilyRichTextModule { }
