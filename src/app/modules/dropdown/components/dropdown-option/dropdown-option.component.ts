import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dropdown-option',
  templateUrl: './dropdown-option.component.html',
  styleUrls: ['./dropdown-option.component.css']
})
export class DropdownOptionComponent implements OnInit {

  /**
   * The option value
   */
  @Input()
  value: unknown;

  /**
   * The option label
   */
  @Input()
  label: string;

  /**
   * Dependency injection site
   */
  constructor() { }

  /**
   * Init component
   */
  ngOnInit(): void {
  }

}
