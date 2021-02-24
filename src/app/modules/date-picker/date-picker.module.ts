import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker.component';
import { OrdinalNumberPipe } from '../ordinal-number-pipe/ordinal-number.pipe';
import { OrdinalNumberPipeModule } from '../ordinal-number-pipe/ordinal-number-pipe.module';

@NgModule({
  declarations: [DatePickerComponent],
  imports: [
    CommonModule,
    OrdinalNumberPipeModule
  ],
  exports: [DatePickerComponent],
  providers: [OrdinalNumberPipe]
})
export class DatePickerModule { }
