import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  add,
  endOfDay,
  endOfMonth,
  endOfWeek,
  getWeek,
  isEqual,
  isWithinInterval,
  setWeek,
  startOfWeek,
  sub
} from 'date-fns';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay, withLatestFrom } from 'rxjs/operators';
import { PopoverComponent } from '../popover/popover.component';

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
   * The year of the week
   */
  year: number;

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
export class WeekPickerComponent implements ControlValueAccessor, OnInit {

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
      this._selectedMonth.next(this.currentDate.month);
      this._selectedYear.next(this.currentDate.year);
    }

    this._value = value;
  }

  /**
   * Set disabled
   */
  @Input('disabled')
  set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  /**
   * Set the valid date boundary for the week picker
   * @param dateRange
   */
  @Input('dateRange')
  set dateRange(dateRange: { start?: Date, end?: Date }) {
    this.setSelectionInterval(dateRange);
    this.setCurrentDateSelectable();
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
   * Format for the selected date range in the selection preview. Must
   * be a valid Angular DatePipe format
   */
  @Input()
  dateFormat = 'MM/dd/y';

  /**
   * Event emitted on week select
   */
  @Output()
  weekSelected = new EventEmitter<{ start: Date, end: Date }>();

  /**
   * ViewChild of the calendar popover
   */
  @ViewChild('calendarPopover')
  calendarPopover: PopoverComponent;

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
   * The selected week of the year of the start of the selection as an Observable
   */
  readonly selectedWeek$: Observable<number> = this._internalValue.pipe(
    map(value => {
      return !value?.start ? 0 : getWeek(value.start);
    }),
    shareReplay()
  );

  /**
   * The year of the start of the selected week as an Observable
   */
  readonly selectedYear$: Observable<number> = this._internalValue.pipe(
    map(value => {
      return !value?.start ? 0 : value.start.getFullYear();
    }),
    shareReplay()
  );

  /**
   * Observable boolean representing if next week (relative to the current selection) is selectable
   */
  readonly canSelectNextWeek$: Observable<boolean> = this.selectedWeek$.pipe(
    withLatestFrom(this._validSelectionInterval, this._selectedYear),
    map(([selectedWeek, selectionInterval, selectedYear]) => {
      let canSelect = false;

      if (selectedWeek > 0 && selectionInterval) {
        const selectedYearStart = new Date(selectedYear, 0, 1);
        const weekDate = setWeek(selectedYearStart, selectedWeek);
        const nextWeekDate = add(weekDate, { weeks: 1 });
        const nextWeekStartDate = startOfWeek(nextWeekDate);
        const nextWeekEndDate = endOfWeek(nextWeekDate);

        canSelect = isWithinInterval(nextWeekStartDate, selectionInterval) &&
          isWithinInterval(nextWeekEndDate, selectionInterval);
      }

      return canSelect;
    })
  );

  /**
   * Observable boolean representing if last week (relative to the current selection) is selectable
   */
  readonly canSelectLastWeek$: Observable<boolean> = this.selectedWeek$.pipe(
    withLatestFrom(this._validSelectionInterval, this._selectedYear),
    map(([selectedWeek, selectionInterval, selectedYear]) => {
      let canSelect = false;

      if (selectedWeek > 0 && selectionInterval) {
        const selectedYearStart = new Date(selectedYear, 0, 1);
        const weekDate = setWeek(selectedYearStart, selectedWeek);
        const lastWeekDate = sub(weekDate, { weeks: 1 });
        const lastWeekStartDate = startOfWeek(lastWeekDate);
        const lastWeekEndDate = endOfWeek(lastWeekDate);

        canSelect = isWithinInterval(lastWeekStartDate, selectionInterval) &&
          isWithinInterval(lastWeekEndDate, selectionInterval);
      }

      return canSelect;
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
            start: selectionInterval.start,
            end: selectionInterval.end
          }
        );
      }

      return fullMonth;
    })
  );

  /**
   * The value of the week picker
   * @private
   */
  private _value;

  /**
   * Whether or not the control is disabled
   * @private
   */
  private _disabled;

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
   * @param selectionInterval the interval representing the
   *                              minimum to the maximum week of the year
   * @private
   */
  private static generateMonth(month: number, year: number, selectionInterval: { start: Date, end: Date }): Array<MetaWeek> {
    const metaMonth: Array<MetaWeek> = [];
    const startOfMonth = new Date(year, month, 1);
    const monthInterval = { start: startOfMonth, end: endOfMonth(startOfMonth) };
    let scrollDate = sub(startOfMonth, { days: startOfMonth.getDay() });

    for (let i = 0; i < 6; i++) {
      const sundayOfWeek = sub(scrollDate, { days: scrollDate.getDay() });
      const saturdayOfWeek = add(scrollDate, { days: 6 - scrollDate.getDay() });

      metaMonth.push({
        week: getWeek(scrollDate),
        year: sundayOfWeek.getFullYear(),
        selectable: (isWithinInterval(sundayOfWeek, monthInterval) ||
          isWithinInterval(saturdayOfWeek, monthInterval)) &&
          isWithinInterval(sundayOfWeek, selectionInterval) &&
          isWithinInterval(saturdayOfWeek, selectionInterval),
        dates: []
      });

      for (let j = 0; j < 7; j++) {
        metaMonth[i].dates.push(scrollDate.getDate());
        scrollDate = add(scrollDate, { days: 1 });
      }
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
   * Function to call on change
   */
  onChange: (value: any) => void = () => {};

  /**
   * Function to call on touch
   */
  onTouched: () => any = () => {};

  /**
   * Dependency injection site
   * @param changeDetectorRef the Angular ChangeDetectorRef
   */
  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.currentDate = WeekPickerComponent.getMetaDate(new Date(), false);
  }

  /**
   * Get the value of the week picker
   */
  get value(): { start: Date, end: Date } {
    return this._value;
  }

  /**
   * Get whether or not the control is disabled
   */
  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Init component
   */
  ngOnInit(): void { }

  /**
   * Write value
   * @param value the value to write
   */
  writeValue(value: { start: Date, end: Date }): void {
    if (!this.disabled) {
      this.value = value;
    }

    this.changeDetectorRef.markForCheck();
  }

  /**
   * Register function on change
   * @param fn the function to change
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Register function on touch
   * @param fn the function to register
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Set disabled state
   * @param isDisabled whether or not the control is disabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Open the week picker popover
   * @param event the event to pass to the popover
   */
  openCalendar(event: Event): void {
    if (!this.disabled) {
      const selectionInterval = this._validSelectionInterval.getValue();
      if (!selectionInterval) {
        this.setSelectionInterval(null);
      }

      this.setCurrentDateSelectable();

      if (!this.value) {
        this._selectedMonth.next(this.currentDate.month);
        this._selectedYear.next(this.currentDate.year);
      } else {
        this._internalValue.next(this.value);
        this._selectedMonth.next(this.value.start.getMonth());
        this._selectedYear.next(this.value.start.getFullYear());
      }

      this.calendarPopover.toggle(event);
    }
  }

  /**
   * Handle week select
   * @param week the week of the year
   * @param selectable whether or not the week is selectable
   */
  onWeekSelect(week: number, selectable: boolean): void {
    const selectedYear = this._selectedYear.getValue();

    if (selectable) {
      const weekDate = setWeek(new Date(selectedYear, 0, 1), week);
      const weekStart = startOfWeek(weekDate);
      const weekEnd = endOfDay(endOfWeek(weekDate));
      const selectedWeek = { start: weekStart, end: weekEnd };

      this.updateModel(selectedWeek);
    }
  }

  /**
   * Select next week (relative to the week of the current selection)
   */
  selectNextWeek(): void {
    const nextWeekDate = add(this.value.start, { weeks: 1 });
    const nextWeekStart = startOfWeek(nextWeekDate);
    const nextWeekEnd = endOfDay(endOfWeek(nextWeekDate));
    const currentMonth = this.value.start.getMonth();
    const selectedWeek = { start: nextWeekStart, end: nextWeekEnd };

    this.updateModel(selectedWeek);

    if (nextWeekStart.getMonth() !== currentMonth) {
      this._selectedMonth.next(nextWeekStart.getMonth());
      this._selectedYear.next(nextWeekStart.getFullYear());
    }
  }

  /**
   * Select last week (relative to the week of the current selection)
   */
  selectLastWeek(): void {
    const lastWeekDate = sub(this.value.start, { weeks: 1 });
    const lastWeekStart = startOfWeek(lastWeekDate);
    const lastWeekEnd = endOfDay(endOfWeek(lastWeekDate));
    const currentMonth = this.value.end.getMonth();
    const selectedWeek = { start: lastWeekStart, end: lastWeekEnd };

    this.updateModel(selectedWeek);

    if (lastWeekEnd.getMonth() !== currentMonth) {
      this._selectedMonth.next(lastWeekStart.getMonth());
      this._selectedYear.next(lastWeekStart.getFullYear());
    }
  }

  /**
   * Select the current week
   */
  selectCurrentWeek(): void {
    const thisWeekDate = new Date(this.currentDate.year, this.currentDate.month, this.currentDate.date);
    const thisWeekStart = startOfWeek(thisWeekDate);
    const thisWeekEnd = endOfDay(endOfWeek(thisWeekDate));

    this.updateModel({ start: thisWeekStart, end: thisWeekEnd });

    this._selectedMonth.next(this.currentDate.month);
    this._selectedYear.next(this.currentDate.year);
  }

  /**
   * Update model
   * @param value the new value of the model
   * @private
   */
  private updateModel(value: { start: Date, end: Date }): void {
    const valueBeforeUpdate = this.value;

    if (!this.disabled) {
      this.value = value;

      if (!isEqual(valueBeforeUpdate.start, this.value.start) &&
        !isEqual(valueBeforeUpdate.end, this.value.end)) {
        this.onChange(this.value);
        this.weekSelected.emit(this.value);
      }
    }
  }

  /**
   * Set the selection interval
   * @param interval the input selection interval
   * @private
   */
  private setSelectionInterval(interval: { start?: Date, end?: Date }): void {
    if (interval?.start > interval?.end) {
      throw new Error('Start date must be less than end date');
    }

    this._validSelectionInterval.next({
      start: interval?.start ?? new Date(this.currentDate.year - 100, 0, 1),
      end: interval?.end ?? new Date(this.currentDate.year + 50, 11, 31)
    });
  }

  /**
   * Set the selectable status of the current date
   * @private
   */
  private setCurrentDateSelectable(): void {
    const today = new Date();
    const selectionInterval = this._validSelectionInterval.getValue();
    const startOfCurrentWeek = sub(today, { days: this.currentDate.day });
    const endOfCurrentWeek = add(today, { days: 6 - this.currentDate.day });

    this.currentDate.selectable = isWithinInterval(startOfCurrentWeek, selectionInterval) &&
      isWithinInterval(endOfCurrentWeek, selectionInterval);
  }
}
