import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TooltipModule} from 'primeng/tooltip';
import {DialogComponent} from './dialog.component';

@NgModule({
  declarations: [
    DialogComponent
  ],
  imports: [
    CommonModule,
    TooltipModule
  ],
  exports: [
    DialogComponent
  ]
})
export class DialogModule {
}
