import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { addDays, endOfMonth, isWithinInterval, subDays } from 'date-fns';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs/index';
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
 * Component that allows a user to select a date from a calendar
 * TODO: Close on escape click
 * TODO: Close on button click
 * TODO: Close on click off
 * TODO: Auto-focus on open
 * TODO: Save on date select
 */
@Component({
  selector: 'wily-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  /**
   * The selected date value
   */
  @Input('value')
  set setValue(value: Date) {
    if (!value || !this.validSelectionInterval) {
      this._value.next(null);
      this.selectedDate = null;
    } else {
      const metaDate = {
        day: value?.getDay(),
        date: value?.getDate(),
        month: value?.getMonth(),
        year: value?.getFullYear(),
        selectable: true
      };

      if (isWithinInterval(value, this.validSelectionInterval)) {
        this._value.next(metaDate);
        this.selectedDate = metaDate;
      } else {
        this._value.next(null);
        this.selectedDate = null;
      }
    }
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

    this.validYearRange = CalendarComponent.generateYearRange(
      (selectionInterval.start as Date).getFullYear(),
      (selectionInterval.end as Date).getFullYear(),
      this.currentDate.year
    );
  }

  /**
   * Event that emits the selected date
   */
  @Output()
  selected = new EventEmitter<Date>();

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
      return CalendarComponent.generateMonth(
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
   * The range of selectable years (based on validSelectionInterval)
   */
  validYearRange: Array<number> = [];

  /**
   * The currently selected date
   */
  selectedDate: MetaDate;

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

  /**
   * Generate an Array of numbers representing the span of years between the input
   * @param minYear the start of the range
   * @param maxYear the end of the range
   * @param currentYear the current year
   */
  private static generateYearRange(minYear, maxYear, currentYear): Array<number> {
    let start: number, end: number;
    if (!minYear && !!maxYear) {
      start = maxYear = 50;
      end = maxYear;
    } else if (!!minYear && !maxYear) {
      start = minYear;
      end = minYear + 50;
    } else if (!!minYear && !!maxYear) {
      start = minYear;
      end = maxYear;
    } else {
      start = currentYear - 50;
      end = currentYear + 50;
    }

    const range: Array<number> = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
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

      this.currentDate.selectable = isWithinInterval(
        new Date(this.currentDate.year, this.currentDate.month, this.currentDate.date),
        this.validSelectionInterval
      );

      this.validYearRange = CalendarComponent.generateYearRange(null, null, year);
    }

    if (!this._value.getValue()) {
      this._selectedMonth.next(this.currentDate.month);
      this._selectedYear.next(this.currentDate.year);
    }

    const value = this._value.getValue();
    if (!!this._value.getValue()) {
      const valueDate = new Date(value.year, value.month, value.date);
      if (!isWithinInterval(valueDate, this.validSelectionInterval)) {
        this._value.next(null);
        this.selectedDate = null;
      }
    }
  }

  /**
   * Update selected date and emit selection event
   * @param selectedDate the selected date
   */
  handleDateSelection(selectedDate: MetaDate): void {
    this.selectedDate = selectedDate;
    this.selected.emit(new Date(selectedDate.year, selectedDate.month, selectedDate.date));
  }

  /**
   * Select the current date and toggle selected month/year to match
   */
  selectToday(): void {
    this.handleDateSelection(this.currentDate);
    this._selectedMonth.next(this.currentDate.month);
    this._selectedYear.next(this.currentDate.year);
  }
}
