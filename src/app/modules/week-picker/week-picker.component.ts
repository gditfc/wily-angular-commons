import { AnimationEvent } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/index';

@Component({
  selector: 'wily-week-picker',
  templateUrl: './week-picker.component.html',
  styleUrls: ['./week-picker.component.css']
})
export class WeekPickerComponent implements OnInit {

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
   * Whether or not the week picker is disabled
   */
  @Input()
  disabled = false;

  /**
   * The aria label to apply to the date range input
   */
  @Input()
  ariaLabel = 'Date';

  /**
   * The current date
   */
  readonly currentDate: any = { selectable: true };

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

  readonly _selectedMonth = new BehaviorSubject(0);

  readonly _selectedYear = new BehaviorSubject(1970);

  readonly fullMonth$: any;

  /**
   * Whether or not to render the week picker
   */
  render = false;

  /**
   * Whether or not to show the week picker
   */
  showCalendar = false;

  selectedDate: any;

  constructor() { }

  ngOnInit(): void {
  }

  onAnimationStart(event: AnimationEvent): void { }

  onAnimationDone(event: AnimationEvent): void { }
}
