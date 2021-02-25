import { Component, OnInit } from '@angular/core';

/**
 * Component to allow a user to input/select a date
 */
@Component({
  selector: 'wily-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

  showCalendar = false;

  console = console;

  constructor() { }

  ngOnInit(): void { }
}
