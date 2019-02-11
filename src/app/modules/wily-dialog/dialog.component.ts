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
  titleClass = 'dialog_header_color';

  @Input()
  bodyClass = 'dialog_body_color';

  @Input()
  height = '66vh';

  @Input()
  width = '1000px';

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

  getStyle(): any {
    return {
     'overflow-y': 'auto',
     'width': this.width,
     'height': this.height
    };
  }

}
