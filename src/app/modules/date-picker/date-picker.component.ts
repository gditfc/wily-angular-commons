import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

/**
 * Component to allow a user to input/select a date
 * TODO: reposition on screen resize
 */
@Component({
  selector: 'wily-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

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
   * Object representing the fixed dimensions of the calendar widget
   */
  readonly calendarDimensions = {
    width: 300,
    height: 340
  };

  /**
   * The amount of padding to apply between the date picker input and the calendar widget
   */
  private readonly calendarPadding = 5;

  /**
   * Whether or not to show the calendar
   */
  showCalendar = false;

  /**
   * Dependency injection site
   * @param renderer the Angular renderer
   */
  constructor(private renderer: Renderer2) { }

  /**
   * Init component, set up window resize listener
   */
  ngOnInit(): void { }

  /**
   * Open the calendar widget
   */
  openCalendar(): void {
    this.setCalendarPosition();
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
    const offsetCalendarHeight = this.calendarDimensions.height + this.calendarPadding;

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
      if (this.calendarDimensions.height > window.innerHeight) {
        topPosition = '0';
      } else {
        const availableSpace = window.innerHeight - this.calendarDimensions.height;
        topPosition = String(availableSpace / 2);
      }

      this.renderer.setStyle(this.calendarDiv.nativeElement, 'transform-origin', 'top left');
      this.renderer.setStyle(this.calendarDiv.nativeElement, 'left', `${x}px`);
      this.renderer.setStyle(this.calendarDiv.nativeElement, 'top', `${topPosition}px`);
    }
  }
}
