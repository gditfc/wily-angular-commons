import { A11yModule } from '@angular/cdk/a11y';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdinalNumberPipeModule } from '../ordinal-number-pipe/ordinal-number-pipe.module';
import { WeekPickerComponent } from './week-picker.component';

@NgModule({
  declarations: [WeekPickerComponent],
  imports: [
    CommonModule,
    OrdinalNumberPipeModule,
    FormsModule,
    A11yModule
  ],
  exports: [WeekPickerComponent]
})
export class WilyWeekPickerModule { }
