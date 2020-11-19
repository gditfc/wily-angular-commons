import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TooltipModule} from 'primeng/tooltip';
import {DialogComponent} from './dialog.component';
import {A11yModule} from '@angular/cdk/a11y';
import {ObserversModule} from '@angular/cdk/observers';

@NgModule({
  declarations: [
    DialogComponent
  ],
    imports: [
      CommonModule,
      TooltipModule,
      A11yModule,
      ObserversModule
    ],
  exports: [
    DialogComponent
  ]
})
export class WilyDialogModule {
}
