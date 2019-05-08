import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconSelectComponent} from './icon-select.component';
import {WilyDialogModule} from '../dialog/wily-dialog.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TooltipModule} from 'primeng/primeng';

@NgModule({
  declarations: [
    IconSelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    WilyDialogModule
  ],
  exports: [
    IconSelectComponent
  ]
})
export class WilyIconSelectModule {
}
