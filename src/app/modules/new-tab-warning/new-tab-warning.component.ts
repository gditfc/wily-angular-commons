import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'wily-new-tab-warning',
  templateUrl: './new-tab-warning.component.html'
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
