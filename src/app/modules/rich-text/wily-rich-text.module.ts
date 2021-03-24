import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RichTextComponent} from './rich-text.component';
import {WilyTooltipModule} from '../tooltip/tooltip.module';

@NgModule({
  declarations: [
    RichTextComponent
  ],
    imports: [
        CommonModule,
        WilyTooltipModule
    ],
  exports: [
    RichTextComponent
  ]
})
export class WilyRichTextModule { }
