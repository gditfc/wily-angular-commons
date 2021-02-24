import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker.component';
import { OrdinalNumberPipe } from '../ordinal-number-pipe/ordinal-number.pipe';
import { OrdinalNumberPipeModule } from '../ordinal-number-pipe/ordinal-number-pipe.module';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from './components/calendar/calendar.component';

@NgModule({
  declarations: [DatePickerComponent, CalendarComponent],
  imports: [
    CommonModule,
    FormsModule,
    OrdinalNumberPipeModule
  ],
  exports: [DatePickerComponent, CalendarComponent],
  providers: [OrdinalNumberPipe]
})
export class DatePickerModule { }
