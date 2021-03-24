import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdinalNumberPipe } from './ordinal-number.pipe';

@NgModule({
  declarations: [OrdinalNumberPipe],
  imports: [
    CommonModule
  ],
  exports: [OrdinalNumberPipe]
})
export class WilyOrdinalNumberPipeModule { }
