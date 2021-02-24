import { Component, Input, OnInit } from '@angular/core';
import { addDays, endOfMonth, isWithinInterval, subDays } from 'date-fns';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs/index';
import { map } from 'rxjs/operators';

/**
 * Interface representing a Date broken down by date/month/year
 * with extended metadata
 */
declare interface MetaDate {

  /**
   * The day of the week (starting at 0)
   */
  day: number;

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
   * The selected date value
   */
  @Input('value')
  set setValue(value: Date) {
    this._value.next({
      day: value?.getDay(),
      date: value?.getDate(),
      month: value?.getMonth(),
      year: value?.getFullYear(),
      selectable: true
    });
  }

  /**
   * The range of available dates to choose from
   */
  @Input('dateRange')
  set setDateRange(dateRange: { minDate: Date, maxDate: Date }) {
    if (dateRange?.minDate > dateRange?.maxDate) {
      throw new Error('Min date must be less than max date');
    }

    let selectionInterval: Interval;
    if (!dateRange) {
      const {year} = this.currentDate;
      selectionInterval = {
        start: new Date(year - 50, 0, 1),
        end: new Date(year + 50, 11, 31)
      };
    } else {
      selectionInterval = { start: dateRange.minDate, end: dateRange.maxDate };
    }

    this.validSelectionInterval = selectionInterval;
    this.currentDate.selectable = isWithinInterval(
      new Date(this.currentDate.year, this.currentDate.month, this.currentDate.date),
      selectionInterval
    );
  }

  /**
   * The current Date broken down by day/month/year
   */
  readonly currentDate: MetaDate;

  /**
   * Array of days of the week
   */
  readonly weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  /**
   * BehaviorSubject tracking the current value
   */
  readonly _value = new BehaviorSubject<MetaDate>(null);

  /**
   * BehaviorSubject tracking the currently selected month
   */
  readonly _selectedMonth = new BehaviorSubject(0);

  /**
   * BehaviorSubject tracking the currently selected year
   */
  readonly _selectedYear = new BehaviorSubject(1970);

  /**
   * The full month for the current selected month/year
   */
  readonly fullMonth$: Observable<Array<MetaDate>> = combineLatest([
    this._selectedMonth,
    this._selectedYear
  ]).pipe(
    map(([selectedMonth, selectedYear]) => {
      return DatePickerComponent.generateMonth(
        selectedMonth,
        selectedYear,
        this.validSelectionInterval
      );
    })
  );

  /**
   * The valid selection interval
   */
  validSelectionInterval: Interval;

  /**
   * Generate a 42 element array representing the input month's days with
   * padding from the previous/following month
   * @param month the month to generate dates for
   * @param year the year to generate the month for
   * @param selectionInterval the selection interval
   */
  private static generateMonth(
    month: number,
    year: number,
    selectionInterval: Interval
  ): Array<MetaDate> {
    if (!!selectionInterval) {
      const beginningOfMonthDate = new Date(year, month, 1);
      const endOfMonthDate = endOfMonth(beginningOfMonthDate);

      const fullMonth: Array<MetaDate> = [];
      let dayOfMonth = beginningOfMonthDate.getDay();
      for (let i = 1; i <= endOfMonthDate.getDate(); i++) {
        const dateOfMonth = new Date(year, month, i);
        fullMonth.push({
          day: dayOfMonth,
          date: i,
          month,
          year,
          selectable: isWithinInterval(dateOfMonth, selectionInterval)
        });

        dayOfMonth = dayOfMonth === 6 ? 0 : dayOfMonth + 1;
      }

      if (beginningOfMonthDate.getDay() > 0) {
        const lastMonthDates: Array<MetaDate> = [];
        for (let i = beginningOfMonthDate.getDay(); i > 0; i--) {
          const subtractedDate = subDays(beginningOfMonthDate, i);
          lastMonthDates.push({
            day: subtractedDate.getDay(),
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
          day: addedDate.getDay(),
          date: addedDate.getDate(),
          month: addedDate.getMonth(),
          year: addedDate.getFullYear(),
          selectable: false
        });
      }

      return fullMonth;
    }

    return null;
  }

  constructor() {
    const currentDate = new Date();
    this.currentDate = {
      day: currentDate.getDay(),
      date: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      selectable: true
    };
  }

  /**
   * Init component
   */
  ngOnInit(): void {
    if (!this.validSelectionInterval) {
      const {year} = this.currentDate;
      this.validSelectionInterval = {
        start: new Date(year - 50, 0, 1),
        end: new Date(year + 50, 11, 31)
      };
    }

    if (!this._value.getValue()) {
      this._selectedMonth.next(this.currentDate.month);
      this._selectedYear.next(this.currentDate.year);
    }
  }
}
