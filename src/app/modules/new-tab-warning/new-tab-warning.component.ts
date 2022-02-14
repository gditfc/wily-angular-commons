import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'wily-new-tab-warning',
  templateUrl: './new-tab-warning.component.html',
  styleUrls: ['./new-tab-warning.component.css']
})
export class NewTabWarningComponent {

  @Input()
  route: string;

  @Output()
  cancelClick = new EventEmitter<void>();

  routeToNewWindow(): void {
    window.open(this.route);
  }

}
