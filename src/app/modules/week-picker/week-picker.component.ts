import { AnimationEvent } from '@angular/animations';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { add, getWeek, getWeeksInMonth, sub } from 'date-fns';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interface representing a Date broken down by day/date/week/month/year
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
   * The week of the year
   */
  week: number;

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
 * Interface representing a week of the year with metadata
 */
declare interface MetaWeek {

  /**
   * The week of the year (starting at 1)
   */
  week: number;

  /**
   * Whether or not the week can be selected in the week picker
   */
  selectable: boolean;

  /**
   * The numeric dates of the days in the week
   */
  dates: Array<number>;
}

/**
 * Component to allow a user to select a week
 */
@Component({
  selector: 'wily-week-picker',
  templateUrl: './week-picker.component.html',
  styleUrls: ['./week-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WeekPickerComponent),
      multi: true
    }
  ]
})
export class WeekPickerComponent implements OnInit {

  /**
   * Set the value of the week picker
   * @param value the value to set
   */
  @Input('value')
  set value(value: { start: Date, end: Date }) {
    if (value?.start && value?.end) {
      const startWeek = getWeek(value.start);
      const endWeek = getWeek(value.end);

      if (startWeek !== endWeek) {
        throw new Error('Start and end must be part of the same week of the year');
      } else if (value.start.getDay() !== 0 || value.end.getDay() !== 6) {
        throw new Error('Start must be the beginning of its week and end must be the end of its week');
      }

      this._internalValue.next(value);
    } else {
      this._internalValue.next(null);
    }

    this._value = value;
  }

  /**
   * Whether or not the week picker is disabled
   */
  @Input()
  disabled = false;

  /**
   * Set the valid date boundary for the week picker
   * @param dateRange
   */
  @Input('dateRange')
  set dateRange(dateRange: { start?: Date, end?: Date }) {
    if (dateRange?.start > dateRange?.end) {
      throw new Error('Start date must be less than end date');
    }

    this._validSelectionInterval.next({
      start: dateRange?.start ?? new Date(this.currentDate.year - 100, 0, 1),
      end: dateRange?.end ?? new Date(this.currentDate.year + 50, 11, 31)
    });
  }

  /**
   * Class list to apply to the date range input
   */
  @Input()
  inputClassList = 'input md overlay_alt2 page_container_color';

  /**
   * Class list to apply to the week picker button
   */
  @Input()
  calendarButtonClassList = 'overlay_alt2 bg_blue_alt brad_3';

  /**
   * The aria label to apply to the date range input
   */
  @Input()
  ariaLabel = 'Date';

  /**
   * The current date
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
   * BehaviorSubject tracking the value of the week picker
   */
  readonly _internalValue = new BehaviorSubject<{ start: Date, end: Date }>(null);

  /**
   * BehaviorSubject tracking the selectable date range
   */
  readonly _validSelectionInterval = new BehaviorSubject<{ start: Date, end: Date }>(null);

  /**
   * BehaviorSubject tracking the currently selected month
   */
  readonly _selectedMonth = new BehaviorSubject(0);

  /**
   * BehaviorSubject tracking the currently selected year
   */
  readonly _selectedYear = new BehaviorSubject(1970);

  /**
   * The selected week of the year as an Observable
   */
  readonly selectedWeek$: Observable<number> = this._internalValue.pipe(
    map(value => {
      return !value?.start ? 0 : getWeek(value.start);
    })
  );

  /**
   * The range of selectable years as an Observable
   */
  readonly validYearRange$: Observable<Array<number>> = this._validSelectionInterval.pipe(
    map(selectionInterval => WeekPickerComponent.generateYearRange(
      selectionInterval?.start?.getFullYear() ?? null,
      selectionInterval?.end?.getFullYear() ?? null,
      this.currentDate.year
    ))
  );

  /**
   * An array of MetaWeeks representing a month as an Observable
   */
  readonly fullMonth$: Observable<Array<MetaWeek>> = combineLatest([
    this._selectedMonth,
    this._selectedYear,
    this._validSelectionInterval
  ]).pipe(
    map(([month, year, selectionInterval]) => {
      let fullMonth: Array<MetaWeek> = null;

      if (selectionInterval) {
        fullMonth = WeekPickerComponent.generateMonth(
          month,
          year,
          {
            startWeek: getWeek(selectionInterval.start),
            endWeek: getWeek(selectionInterval.end)
          }
        );
      }

      return fullMonth;
    })
  );

  /**
   * Whether or not to render the week picker
   */
  render = false;

  /**
   * Whether or not to show the week picker
   */
  showCalendar = false;

  // TODO: Delete
  selectedDate: any;

  /**
   * Subscription for the combination of value and valid selection interval
   * @private
   */
  private readonly subscription = new Subscription();

  /**
   * The value of the week picker
   * @private
   */
  private _value;

  /**
   * Generate an Array of numbers representing the span of years between the input
   * @param minYear the start of the range
   * @param maxYear the end of the range
   * @param currentYear the current year
   */
  private static generateYearRange(minYear, maxYear, currentYear): Array<number> {
    let start: number, end: number;
    if (!minYear && maxYear) {
      start = maxYear = 50;
      end = maxYear;
    } else if (minYear && !maxYear) {
      start = minYear;
      end = minYear + 50;
    } else if (minYear && maxYear) {
      start = minYear;
      end = maxYear;
    } else {
      start = currentYear - 100;
      end = currentYear + 50;
    }

    const range: Array<number> = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  }

  /**
   * Generate a month with week and selectable status metadata
   * @param month the month to generate
   * @param year the year of the month to generate
   * @param selectionWeekInterval the interval representing the
   *                              minimum to the maximum week of the year
   * @private
   */
  private static generateMonth(
    month: number,
    year: number,
    selectionWeekInterval: { startWeek: number, endWeek: number }
  ): Array<{ week: number, selectable: boolean, dates: Array<number> }> {
    const metaMonth: Array<{ week: number, selectable: boolean, dates: Array<number> }> = [];
    const weeksInMonth = getWeeksInMonth(month);
    const startOfMonth = new Date(year, month, 1);
    let scrollDate = sub(startOfMonth, { days: startOfMonth.getDay() });

    for (let i = 0; i < 6; i++) {
      const { date, week } = this.getMetaDate(scrollDate);
      metaMonth.push({
        week,
        selectable: ((i + 1) <= weeksInMonth) &&
                    (week >= selectionWeekInterval.startWeek) &&
                    (week <= selectionWeekInterval.endWeek),
        dates: []
      });

      for (let j = 0; j <= 7; j++) {
        metaMonth[i].dates.push(date + j);
      }

      scrollDate = add(scrollDate, { weeks: 1 });
    }


    return metaMonth;
  }

  /**
   * Get the input date as a MetaDate
   * @param date the date to transform
   * @param selectable whether or not the date is selectable
   * @private
   */
  private static getMetaDate(date: Date, selectable = false): MetaDate {
    return {
      day: date.getDay(),
      date: date.getDate(),
      week: getWeek(date),
      month: date.getMonth(),
      year: date.getFullYear(),
      selectable: selectable
    };
  }

  /**
   * Dependency injection site
   */
  constructor() {
    this.currentDate = WeekPickerComponent.getMetaDate(new Date(), false);
  }

  /**
   * Get the value of the week picker
   */
  get value(): { start: Date, end: Date } {
    return this._value;
  }

  /**
   * Init component, set up subscription to compare the week picker value
   * with the valid selection interval
   */
  ngOnInit(): void {
    this.subscription.add(
      combineLatest([this._internalValue, this._validSelectionInterval]).subscribe(
        ([value, validSelectionInterval]) => {
          let selectionInterval = validSelectionInterval;

          if (!selectionInterval) {
            const {year} = this.currentDate;
            selectionInterval = {
              start: new Date(year - 100, 0, 1),
              end: new Date(year + 50, 11, 31)
            };
          }

          const minimumWeek = getWeek(selectionInterval.start);
          const maximumWeek = getWeek(selectionInterval.end);
          const currentWeek = this.currentDate.week;

          this.currentDate.selectable = (currentWeek >= minimumWeek) && (currentWeek <= maximumWeek);

          if (value) {
            const valueWeek = getWeek(value.start);

            if (valueWeek) {
              this._selectedMonth.next(value.start.getMonth());
              this._selectedYear.next(value.start.getFullYear());
            } else {
              this._value.next(null);
              this.selectedDate = null;
            }
          } else {
            this._selectedMonth.next(this.currentDate.month);
            this._selectedYear.next(this.currentDate.year);
          }
        })
    );
  }

  onAnimationStart(event: AnimationEvent): void { }

  onAnimationDone(event: AnimationEvent): void { }

  /**
   * Open the week picker calendar
   */
  openCalendar(): void {
    this.render = true;
    this.showCalendar = true;
  }
}
