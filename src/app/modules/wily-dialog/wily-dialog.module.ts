import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';
import {WilyDialogComponent} from './wily-dialog.component';

@NgModule({
  declarations: [
    WilyDialogComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    TooltipModule
  ],
  exports: [
    WilyDialogComponent
  ]
})
export class WilyDialogModule {
}
