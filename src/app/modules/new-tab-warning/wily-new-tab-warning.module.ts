import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTabWarningComponent } from './new-tab-warning.component';

@NgModule({
  declarations: [NewTabWarningComponent],
  imports: [
    CommonModule
  ],
  exports: [NewTabWarningComponent]
})
export class WilyNewTabWarningModule { }
