import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

/**
 * Component to allow a user to input/select a date
 * TODO: position calendar either above/below input based on viewport/height
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
   * ViewChild of the calendar overlay div
   */
  @ViewChild('calendarOverlayDiv')
  calendarOverlayDiv: ElementRef<HTMLDivElement>;

  /**
   * Object representing the fixed dimensions of the calendar widget
   */
  readonly calendarDimensions = {
    width: 300,
    height: 340
  };

  private readonly calendarPadding = 5;

  showCalendar = false;

  console = console;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void { }

  openCalendar(): void {
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
    }

    this.renderer.setStyle(this.calendarOverlayDiv.nativeElement, 'display', '');
    this.showCalendar = true;
  }

  handleCalendarClose(): void {
    this.renderer.setStyle(this.calendarOverlayDiv.nativeElement, 'display', 'none');
    this.showCalendar = false;
  }
}
