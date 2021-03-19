import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerComponent } from './color-picker.component';

@NgModule({
  declarations: [ColorPickerComponent],
  imports: [CommonModule],
  exports: [ColorPickerComponent]
})
export class WilyColorPickerModule { }
