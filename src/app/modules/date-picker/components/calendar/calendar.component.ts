import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {addDays, endOfMonth, Interval, isWithinInterval, subDays} from 'date-fns';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
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
 * TODO: replace observer for click listener with host listener (prevent event immediate propogation in parent)
 */
@Component({
  selector: 'wily-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements AfterViewInit, OnDestroy, OnInit {

  /**
   * ViewChild of the calendar widget parent div element
   */
  @ViewChild('calendarWidgetDiv')
  calendarWidgetDiv: ElementRef<HTMLDivElement>;

  /**
   * ViewChild of the month select element
   */
  @ViewChild('yearSelect')
  yearSelect: ElementRef<HTMLSelectElement>;

  /**
   * The selected date value
   */
  @Input('value')
  set setValue(value: Date) {
    let metaDateValue: MetaDate = null;

    if (!!value) {
      metaDateValue = {
        day: value.getDay(),
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear(),
        selectable: true
      };
    }

    this._value.next(metaDateValue);
  }

  /**
   * The range of available dates to choose from
   */
  @Input('dateRange')
  set setDateRange(dateRange: { minDate: Date, maxDate: Date }) {
    if (dateRange?.minDate > dateRange?.maxDate) {
      throw new Error('Min date must be less than max date');
    }

    const {year} = this.currentDate;
    this._validSelectionInterval.next({
      start: dateRange?.minDate ?? new Date(year - 50, 0, 1),
      end: dateRange?.maxDate ?? new Date(year + 50, 11, 31)
    });
  }

  /**
   * Event emitted on date select
   */
  @Output()
  selected = new EventEmitter<Date>();

  /**
   * Event emitted on close (either through the button, escape keyup or click off of widget).
   * Note: it is the parent component's job to actually hide the calendar, this event
   *       acts as a signal that that action should be taken
   */
  @Output()
  closed = new EventEmitter<void>();

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
   * BehaviorSubject tracking the valid selection interval
   */
  readonly _validSelectionInterval = new BehaviorSubject<Interval>(null);

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
    this._selectedYear,
    this._validSelectionInterval
  ]).pipe(
    map(([selectedMonth, selectedYear, validSelectionInterval]) => {
      return CalendarComponent.generateMonth(
        selectedMonth,
        selectedYear,
        validSelectionInterval
      );
    })
  );

  /**
   * The range of selectable years
   */
  readonly validYearRange$: Observable<Array<number>> = this._validSelectionInterval.pipe(
    map(selectionInterval => CalendarComponent.generateYearRange(
      (selectionInterval?.start as Date)?.getFullYear() ?? null,
      (selectionInterval?.end as Date)?.getFullYear() ?? null,
      this.currentDate.year
    ))
  );

  /**
   * Subscription for the combination of value and valid selection interval
   * @private
   */
  private readonly subscription = new Subscription();

  /**
   * The currently selected date
   */
  selectedDate: MetaDate;

  /**
   * Whether or not the click listener should respond to clicks
   */
  listenToClicks = false;

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

  /**
   * Dependency injection site
   * @param renderer the Angular renderer
   */
  constructor(private renderer: Renderer2) {
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
    this.subscription.add(
      combineLatest([this._value, this._validSelectionInterval]).subscribe(
      ([value, validSelectionInterval]) => {
        let selectionInterval = validSelectionInterval;

        if (!selectionInterval) {
          const {year} = this.currentDate;
          selectionInterval = {
            start: new Date(year - 50, 0, 1),
            end: new Date(year + 50, 11, 31)
          };

          this.currentDate.selectable = isWithinInterval(
            new Date(this.currentDate.year, this.currentDate.month, this.currentDate.date),
            selectionInterval
          );
        }

        if (!!value) {
          const valueDate = new Date(value.year, value.month, value.date);
          if (isWithinInterval(valueDate, selectionInterval)) {
            this.selectedDate = value;
            this._selectedMonth.next(value.month);
            this._selectedYear.next(value.year);
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

  /**
   * Enable click listening and focus on year select
   */
  ngAfterViewInit(): void {
    this.yearSelect.nativeElement.focus();
  }

  /**
   * Destroy component, unsubscribe from any active subscriptions
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Emit closed event on escape keyup
   * @param event the keyup KeyboardEvent
   */
  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    const {key} = event;
    if (key === 'Esc' || key === 'Escape') {
      this.closed.emit();
    }
  }

  /**
   * Emit closed event on click if clicked outside calendar widget
   * @param event the click MouseEvent
   */
  @HostListener('window:click', ['$event'])
  handleClick(event: MouseEvent) {
    if (this.listenToClicks) {
      const {pageX, pageY} = event;

      // this check is to prevent the click event from firing on keypress when focused on a button
      if (pageX > 0 && pageY > 0) {
        const {top, bottom, left, right} = this.calendarWidgetDiv.nativeElement.getBoundingClientRect();

        const insideX = (pageX >= left) && (pageX <= right);
        const insideY = (pageY >= top) && (pageY <= bottom);
        const shouldClose = !(insideX && insideY);

        if (shouldClose) {
          this.closed.emit();
        }
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
