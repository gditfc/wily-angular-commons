import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {coerceBooleanProperty} from "@angular/cdk/coercion";

/**
 * Component to allow a user to input/select a date
 * TODO: figure out close animation
 * TODO: implement control value accessor
 * TODO: sync input with calendar
 * TODO: validate input as date format
 * TODO: handle paste
 */
@Component({
  selector: 'wily-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  animations: [
    trigger('openClose', [
      transition('closed => open', [
        animate('240ms ease', keyframes([
          style({
            opacity: 0,
            transform: 'scaleY(0.5)',
            offset: 0
          }),
          style({ opacity: 0, offset: .25 }),
          style({ opacity: 1, transform: 'scaleY(1)', offset: 1 })
        ]))
      ])
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
   * Allowed keys for date input
   */
  private static readonly ALLOWED_KEYS = [
    '0', '1', '2', '3', '4', '5', '6', '7',
    '9', 'Tab', 'Enter', '/', 'ArrowLeft',
    'ArrowUp', 'ArrowRight', 'ArrowDown',
    'ShiftLeft', 'ShiftRight', 'Backspace',
    'Delete'
  ];

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
   * ViewChild of the calendar overlay div
   */
  @ViewChild('calendarOverlayDiv')
  calendarOverlayDiv: ElementRef<HTMLDivElement>;

  /**
   * Value input getter
   */
  @Input()
  get value(): Date {
    return null;
  }

  /**
   * Value input setter
   */
  set value(value: Date) {
    if (this._value !== value) {
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

  /**
   * Object representing the fixed dimensions of the calendar widget
   */
  private readonly calendarHeight = 340;

  /**
   * The amount of padding to apply between the date picker input and the calendar widget
   */
  private readonly calendarPadding = 5;

  /**
   * Whether or not to show the calendar
   */
  showCalendar = false;

  /**
   * Function to call on change
   */
  onChange: (value: any) => void = () => {};

  /**
   * Function to call on touch
   */
  onTouched: () => any = () => {};

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
   * Dependency injection site
   * @param renderer the Angular renderer
   * @param changeDetectorRef the Angular change detector
   */
  constructor(private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef) { }

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
    this.value = value;
    this.onChange(this.value);
    this.changeDetectorRef.markForCheck();
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
    if (!DatePickerComponent.ALLOWED_KEYS.includes(key)) {
      event.preventDefault();
    }
  }

  /**
   * Open the calendar widget
   */
  openCalendar(): void {
    this.setCalendarPosition();
    this.renderer.setStyle(this.calendarOverlayDiv.nativeElement, 'display', '');
    this.showCalendar = true;
  }

  /**
   * Hide calendar overlay and remove calendar from the DOM
   */
  handleCalendarClose(): void {
    this.showCalendar = false;
  }

  /**
   * Calculate and set the calendar's position based on the screen height.
   * Positioning prefers to open at the bottom, if not enough room on bottom,
   * positioning is attempted at the top, otherwise it attempts to vertically
   * center
   */
  private setCalendarPosition(): void {
    const {x, y, height} = this.datePickerDiv.nativeElement.getBoundingClientRect();
    const datePickerBottomLeftAnchor = y + height;
    const availableBottomSpace = window.innerHeight - datePickerBottomLeftAnchor;
    const availableTopSpace = y;
    const offsetCalendarHeight = this.calendarHeight + this.calendarPadding;

    if (availableBottomSpace > offsetCalendarHeight) {
      this.renderer.setStyle(this.calendarDiv.nativeElement, 'transform-origin', 'top left');
      this.renderer.setStyle(this.calendarDiv.nativeElement, 'left', `${x}px`);
      this.renderer.setStyle(this.calendarDiv.nativeElement, 'top', `${datePickerBottomLeftAnchor + this.calendarPadding}px`);
    } else if (availableTopSpace > offsetCalendarHeight) {
      this.renderer.setStyle(this.calendarDiv.nativeElement, 'transform-origin', 'bottom left');
      this.renderer.setStyle(this.calendarDiv.nativeElement, 'left', `${x}px`);
      this.renderer.setStyle(this.calendarDiv.nativeElement, 'top', `${y - offsetCalendarHeight}px`);
    } else {
      let topPosition: string;
      if (this.calendarHeight > window.innerHeight) {
        topPosition = '0';
      } else {
        const availableSpace = window.innerHeight - this.calendarHeight;
        topPosition = String(availableSpace / 2);
      }

      this.renderer.setStyle(this.calendarDiv.nativeElement, 'transform-origin', 'top left');
      this.renderer.setStyle(this.calendarDiv.nativeElement, 'left', `${x}px`);
      this.renderer.setStyle(this.calendarDiv.nativeElement, 'top', `${topPosition}px`);
    }
  }
}
