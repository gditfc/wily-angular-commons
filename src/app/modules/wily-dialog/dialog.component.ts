import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'wily-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogComponent {

  @Input()
  object: any;

  @Input()
  title: string;

  @Input()
  titleClass = 'bg_color_1';

  @ViewChild('dialog')
  dialog: Dialog;

  @Output()
  closed: EventEmitter<any> = new EventEmitter();

  close(): void {
    this.dialog.close(new Event(''));
    this.closed.emit({});
  }

  open(): void {
    if (this.dialog && window.innerWidth < 768) {
      setTimeout(() => {
        try {
          this.dialog.maximize();
        } catch (e) {
        } // Ignore this error, nonsense.
      }, 100);
    }
  }

}
