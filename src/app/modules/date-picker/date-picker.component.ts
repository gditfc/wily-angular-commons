import { Component, OnInit } from '@angular/core';
import { addDays, endOfMonth, subDays } from 'date-fns';

/**
 * Interface representing a Date broken down by date/month/year
 * with extended metadata
 */
declare interface MetaDate {
  /**
   * The day of the month (starting at 1)
   */
  date: number;

  /**
   * The month (starting at 0)
   */
  month: number;

  /**
   * The full year
   */
  year: number;

  /**
   * Whether or not the day is selectable
   */
  selectable: boolean;
}

/**
 * Component to allow a user to input/select a date
 */
@Component({
  selector: 'wily-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

  /**
   * The current Date broken down by day/month/year
   */
  readonly currentDate: MetaDate;

  /**
   * The full month for the current selected month/year
   */
  fullMonth: Array<MetaDate> = [];

  /**
   * Generate a 42 element array representing the input month's days with
   * padding from the previous/following month
   * @param month the month to generate dates for
   * @param year the year to generate the month for
   */
  private static generateMonth(month: number, year: number): Array<MetaDate> {
    const beginningOfMonthDate = new Date(year, month, 1);
    const endOfMonthDate = endOfMonth(beginningOfMonthDate);

    const fullMonth: Array<MetaDate> = [];
    for (let i = 1; i <= endOfMonthDate.getDate(); i++) {
      fullMonth.push({
        date: i,
        month,
        year,
        selectable: true
      });
    }

    if (beginningOfMonthDate.getDay() > 0) {
      const lastMonthDates: Array<MetaDate> = [];
      for (let i = beginningOfMonthDate.getDay(); i > 0; i--) {
        const subtractedDate = subDays(beginningOfMonthDate, i);
        lastMonthDates.push({
          date: subtractedDate.getDate(),
          month: subtractedDate.getMonth(),
          year: subtractedDate.getFullYear(),
          selectable: false
        });
      }

      fullMonth.unshift(...lastMonthDates);
    }

    let daysToAdd = 1;
    while (fullMonth.length < 42) {
      const addedDate = addDays(endOfMonthDate, daysToAdd++);
      fullMonth.push({
        date: addedDate.getDate(),
        month: addedDate.getMonth(),
        year: addedDate.getFullYear(),
        selectable: false
      });
    }

    return fullMonth;
  }

  constructor() {
    const currentDate = new Date();
    this.currentDate = {
      date: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear()
    } as MetaDate;

    this.fullMonth = DatePickerComponent.generateMonth(this.currentDate.month, this.currentDate.year);
  }

  ngOnInit(): void {
  }
}
