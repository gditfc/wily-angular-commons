import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';
import {WilyFlexDialogComponent} from './wily-flex-dialog.component';

@NgModule({
  declarations: [
    WilyFlexDialogComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    TooltipModule
  ],
  exports: [
    WilyFlexDialogComponent
  ]
})
export class WilyFlexDialogModule {
}
