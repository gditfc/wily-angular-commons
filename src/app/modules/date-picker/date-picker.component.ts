import { Component, OnInit } from '@angular/core';

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

  showCalendar = false;

  console = console;

  constructor() { }

  ngOnInit(): void { }
}
