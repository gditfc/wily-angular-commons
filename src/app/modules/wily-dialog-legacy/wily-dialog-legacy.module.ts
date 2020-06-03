import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WilyDialogLegacyComponent} from './wily-dialog-legacy.component';
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  declarations: [
    WilyDialogLegacyComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    TooltipModule,
  ],
  exports: [
    WilyDialogLegacyComponent
  ]
})
export class WilyDialogLegacyModule {
}
