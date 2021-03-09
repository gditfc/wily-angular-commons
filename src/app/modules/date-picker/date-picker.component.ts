import { animate, AnimationEvent, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { format, isEqual, isValid, isWithinInterval, parse } from 'date-fns';

/**
 * Component to allow a user to input/select a date
 */
@Component({
  selector: 'wily-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  animations: [
    trigger('openClose', [
      transition('void => open', [
        style({ transform: 'scaleY(0.5)', opacity: 0 }),
        animate('200ms ease',
          style({ transform: 'scaleY(1)', opacity: 1 }))
      ]),
      transition('open => close', [
        style({ transform: 'scaleY(1)', opacity: 1 }),
        animate('200ms ease',
          style({ transform: 'scaleY(0.5)', opacity: 0 }))
      ]),
    ])
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor, OnDestroy, OnInit {

  /**
   * Value input getter
   */
  @Input()
  get value(): Date {
    return DatePickerComponent.parseDateString(this.dateString);
  }

  /**
   * Value input setter
   */
  set value(value: Date) {
    if (!isEqual(value, this._value)) {
      this._value = value;
    }
  }

  /**
   * Disabled input
   */
  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  @Input('dateRange')
  set setDateRange(dateRange: { minDate: Date, maxDate: Date }) {
    if (dateRange?.minDate > dateRange?.maxDate) {
      throw new Error('Min date must be less than max date');
    }

    const year = this.currentDate.getFullYear();
    this.validSelectionInterval = {
      start: dateRange?.minDate ?? new Date(year - 50, 0, 1),
      end: dateRange?.maxDate ?? new Date(year + 50, 11, 31)
    };
  }

  /**
   * Dependency injection site
   * @param renderer the Angular renderer
   * @param changeDetectorRef the Angular change detector
   */
  constructor(private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef) { }

  /**
   * Allowed keys for date input
   */
  private static readonly ALLOWED_KEYS = [
    '0', '1', '2', '3', '4', '5', '6', '7',
    '8', '9', 'Tab', 'Enter', '/', 'ArrowLeft',
    'ArrowUp', 'ArrowRight', 'ArrowDown',
    'ShiftLeft', 'ShiftRight', 'Backspace',
    'Delete'
  ];

  /**
   * Matches MM/DD/YYYY
   * @private
   */
  private static readonly FULL_DATE_FORMAT = new RegExp('^\\d\\d\\/\\d\\d\\/\\d\\d\\d\\d$');

  /**
   * Matches M/D/YYYY
   * @private
   */
  private static readonly SHORT_DATE_FORMAT = new RegExp('^\\d\\/\\d\\/\\d\\d\\d\\d$');

  /**
   * Matches M/DD/YYYY
   * @private
   */
  private static readonly SHORT_MONTH_DATE_FORMAT = new RegExp('^\\d\\/\\d\\d\\/\\d\\d\\d\\d$');

  /**
   * Matches MM/D/YYYY
   * @private
   */
  private static readonly SHORT_DAY_DATE_FORMAT = new RegExp('^\\d\\d\\/\\d\\/\\d\\d\\d\\d$');

  /**
   * A reference date with all fields set to 0
   * @private
   */
  private static readonly referenceDate = new Date(0, 0, 0, 0, 0, 0, 0);

  /**
   * ViewChild of the date picker div
   */
  @ViewChild('datePickerDiv')
  datePickerDiv: ElementRef<HTMLDivElement>;

  /**
   * ViewChild of the calendar div
   */
  @ViewChild('calendarDiv')
  calendarDiv: ElementRef<HTMLDivElement>;

  /**
   * Optional class-list to add to the date picker input
   */
  @Input()
  inputClassList = '';

  /**
   * Optional class-list to add to the calendar button
   */
  @Input()
  calendarButtonClassList = '';

  /**
   * Event emitted on date picker input
   */
  @Output()
  input = new EventEmitter<void>();

  /**
   * The current date
   */
  private readonly currentDate = new Date();

  /**
   * The fixed height of the calendar widget
   */
  private readonly calendarHeight = 340;

  /**
   * The fixed width of the calendar widget
   */
  private readonly calendarWidth = 300;

  /**
   * The amount of padding to apply between the date picker input and the calendar widget
   */
  private readonly calendarPadding = 0;

  /**
   * String tracking date picker input
   */
  dateString = '';

  /**
   * Whether or not the calendar should be rendered
   */
  render: boolean;

  /**
   * Whether or not to show the calendar
   */
  showCalendar: { currentValue: Date } = null;

  /**
   * The valid selection interval
   * @private
   */
  validSelectionInterval = {
    start: new Date(this.currentDate.getFullYear() - 50, 0, 1),
    end: new Date(this.currentDate.getFullYear() + 50, 0, 1)
  };

  /**
   * The internal control accessor value
   * @private
   */
  private _value: Date = null;

  /**
   * The internal disabled state
   * @private
   */
  private _disabled = false;

  /**
   * Window resize unlisten function
   */
  private resizeListener: () => void;

  /**
   * Parse the input Date value into a string
   * @param value the value to parse
   * @private
   */
  private static parseDate(value: Date): string {
    return !value ? null : format(value, 'MM/dd/yyyy');
  }

  /**
   * Parse the input date string into a Date
   * @param dateString the string to parse
   * @private
   */
  private static parseDateString(dateString: string): Date {
    let parsedDate: Date;
    try {
      parsedDate = parse(dateString, DatePickerComponent.getDateFormat(dateString), this.referenceDate);
    } catch (e) {
      parsedDate = null;
    }

    return isValid(parsedDate) ? parsedDate : null;
  }

  /**
   * Get the date format that matches the input date string, null if no match
   * @param dateString the string to test
   * @private
   */
  private static getDateFormat(dateString: string): string {
    this.FULL_DATE_FORMAT.lastIndex = 0;
    this.SHORT_MONTH_DATE_FORMAT.lastIndex = 0;
    this.SHORT_DAY_DATE_FORMAT.lastIndex = 0;
    this.SHORT_DATE_FORMAT.lastIndex = 0;

    let dateFormat: string = null;
    if (this.FULL_DATE_FORMAT.test(dateString)) {
      dateFormat = 'MM/dd/yyyy';
    } else if (this.SHORT_MONTH_DATE_FORMAT.test(dateString)) {
      dateFormat = 'M/dd/yyyy';
    } else if (this.SHORT_DAY_DATE_FORMAT.test(dateString)) {
      dateFormat = 'MM/d/yyyy';
    } else if (this.SHORT_DATE_FORMAT.test(dateString)) {
      dateFormat = 'M/d/yyyy';
    }

    return dateFormat;
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
   * Init component, set up window resize listener
   */
  ngOnInit(): void {
    this.resizeListener = this.renderer.listen(window, 'resize', () => {
      if (this.showCalendar) {
        this.setCalendarPosition();
      }
    });
  }

  /**
   * Destroy component, invoke window resize unlisten function
   */
  ngOnDestroy(): void {
    this.resizeListener();
  }

  /**
   * Write value
   * @param value the value to write
   */
  writeValue(value: Date): void {
    if (value !== null && isWithinInterval(value, this.validSelectionInterval)) {
      this.value = value;
      this.dateString = DatePickerComponent.parseDate(value);
    } else {
      this.value = null;
      this.dateString = null;
    }

    this.onChange(this.value);
    this.changeDetectorRef.markForCheck();
    this.input.emit();
  }

  /**
   * Register control value accessor change function
   * @param fn the function to register
   */
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  /**
   * Register touch handler
   * @param fn the touch handler to register
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Set the disabled state
   * @param isDisabled whether or not the component should be disabled
   */
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Only allow input from digits, forward slashes, and navigation keys
   */
  filterInput(event: KeyboardEvent): void {
    const {key} = event;
    if (!DatePickerComponent.ALLOWED_KEYS.includes(key) && !event.ctrlKey) {
      event.preventDefault();
    }
  }

  /**
   * Clear value if no input, write parsed date if input requirements fulfilled
   */
  handleBlur() {
    try {
      this.writeValue(DatePickerComponent.parseDateString(this.dateString));
    } catch (e) {
      this.writeValue(null);
    }
  }

  /**
   * Write on input if valid date within interval
   */
  handleInput() {
    try {
      const parsedDate = DatePickerComponent.parseDateString(this.dateString);
      if (parsedDate !== null && isWithinInterval(parsedDate, this.validSelectionInterval)) {
        this.writeValue(parsedDate);
      }
    } catch (e) { }
  }

  /**
   * Set calendar position on animation start if toState is open
   * @param event the Angular AnimationEvent
   */
  onAnimationStart(event: AnimationEvent): void {
    if (event.toState === 'open') {
      this.setCalendarPosition();
    }
  }

  /**
   * Flip render to false on animation done if toState is close
   * @param event the Angular AnimationEvent
   */
  onAnimationDone(event: AnimationEvent): void {
    if (event.toState === 'close') {
      this.render = false;
    }
  }

  /**
   * Open the calendar widget
   * @param event the click MouseEvent
   */
  openCalendar(event: MouseEvent): void {
    event.stopImmediatePropagation();

    this.showCalendar = { currentValue: this.value };
    this.render = true;
  }

  /**
   * Hide calendar overlay and remove calendar from the DOM
   */
  handleCalendarClose(): void {
    this.showCalendar = null;
  }

  /**
   * Calculate and set the calendar's position based on the screen height.
   * Positioning prefers to open at the bottom, if not enough room on bottom,
   * positioning is attempted at the top, otherwise it attempts to vertically
   * center
   */
  private setCalendarPosition(): void {
    const {left, top, bottom} = this.datePickerDiv.nativeElement.getBoundingClientRect();
    const datePickerBottomLeftAnchor = bottom;
    const availableBottomSpace = window.innerHeight - datePickerBottomLeftAnchor;
    const availableTopSpace = top;
    const offsetCalendarHeight = this.calendarHeight + this.calendarPadding;
    let leftPosition: number, topPosition: number, transformOrigin: string;

    if (availableBottomSpace > offsetCalendarHeight) {
      transformOrigin = 'top left';
      topPosition = datePickerBottomLeftAnchor + this.calendarPadding;
    } else if (availableTopSpace > offsetCalendarHeight) {
      transformOrigin = 'bottom left';
      topPosition = top - offsetCalendarHeight;
    } else {
      transformOrigin = 'top left';

      if (this.calendarHeight > window.innerHeight) {
        topPosition = 0;
      } else {
        const availableSpace = window.innerHeight - this.calendarHeight;
        topPosition = availableSpace / 2;
      }
    }

    leftPosition = left;
    if ((left + this.calendarWidth) > window.innerWidth) {
      leftPosition = left - ((left + this.calendarWidth) - window.innerWidth) - 10;
    }

    this.renderer.setStyle(this.calendarDiv.nativeElement, 'transform-origin', transformOrigin);
    this.renderer.setStyle(this.calendarDiv.nativeElement, 'left', `${leftPosition}px`);
    this.renderer.setStyle(this.calendarDiv.nativeElement, 'top', `${topPosition}px`);
  }
}
