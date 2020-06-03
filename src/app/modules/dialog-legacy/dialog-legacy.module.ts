import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogLegacyComponent} from './dialog-legacy.component';
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  declarations: [
    DialogLegacyComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    TooltipModule,
  ],
  exports: [
    DialogLegacyComponent
  ]
})
export class WilyDialogLegacyModule {
}
