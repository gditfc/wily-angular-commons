import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';

/**
 * Component to allow a user to input/select a date
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
      ]),
      transition('open => closed', [
        animate('240ms ease', keyframes([
          style({ opacity: 1, transform: 'scaleY(1)', offset: 0 }),
          style({ opacity: 0, offset: .25 }),
          style({
            opacity: 0,
            transform: 'scaleY(0.5)',
            offset: 1
          })
        ]))
      ])
    ])
  ]
})
export class DatePickerComponent implements OnDestroy, OnInit {

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
   * Window resize unlisten function
   */
  private resizeListener: () => void;

  /**
   * Dependency injection site
   * @param renderer the Angular renderer
   */
  constructor(private renderer: Renderer2) { }

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
