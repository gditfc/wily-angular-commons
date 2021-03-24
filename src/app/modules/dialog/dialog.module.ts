import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogComponent} from './dialog.component';
import {A11yModule} from '@angular/cdk/a11y';

@NgModule({
  declarations: [
    DialogComponent
  ],
  imports: [
    CommonModule,
    A11yModule
  ],
  exports: [
    DialogComponent
  ]
})
export class WilyDialogModule {
}
