import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogComponent} from './dialog.component';
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  declarations: [
    DialogComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    TooltipModule,
  ],
  exports: [
    DialogComponent
  ]
})
export class WilyDialogModule {
}
