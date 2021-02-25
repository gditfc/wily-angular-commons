import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker.component';
import { OrdinalNumberPipe } from '../ordinal-number-pipe/ordinal-number.pipe';
import { OrdinalNumberPipeModule } from '../ordinal-number-pipe/ordinal-number-pipe.module';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from './components/calendar/calendar.component';
import { A11yModule } from '@angular/cdk/a11y';
import { ObserversModule } from '@angular/cdk/observers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [DatePickerComponent, CalendarComponent],
  imports: [
    A11yModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ObserversModule,
    OrdinalNumberPipeModule
  ],
  exports: [DatePickerComponent, CalendarComponent],
  providers: [OrdinalNumberPipe]
})
export class DatePickerModule { }
