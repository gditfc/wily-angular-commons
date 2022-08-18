import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RichTextComponent} from './rich-text.component';
import {WilyTooltipModule} from '../tooltip/tooltip.module';
import {NgxTiptapModule} from 'ngx-tiptap';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RichTextSafeRenderComponent} from './rich-text-safe-render.component';
import {DOMPURIFY_CONFIG, NgDompurifyModule} from '@tinkoff/ng-dompurify';

@NgModule({
  declarations: [
    RichTextComponent,
    RichTextSafeRenderComponent
  ],
  imports: [
    CommonModule,
    WilyTooltipModule,
    NgxTiptapModule,
    FormsModule,
    BrowserModule,
    NgDompurifyModule
  ],
  providers: [
    {
      provide: DOMPURIFY_CONFIG,
      useValue: {ADD_ATTR: ['target']},
    },
  ],
  exports: [
    RichTextComponent,
    RichTextSafeRenderComponent
  ]
})
export class WilyRichTextModule {
}
