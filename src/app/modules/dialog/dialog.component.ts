import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Dialog} from 'primeng/dialog';

/**
 * Wily Dialog component wraps a PrimeNG dialog to make it behave in the exact way that we want to, along with styles to make it look
 * consistent across all use cases.
 */
@Component({
  selector: 'wily-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogComponent {

  /**
   * Object to operate whether the dialog is open/closed
   */
  @Input()
  object: any;

  /**
   * Title to show at the top of the dialog
   */
  @Input()
  title: string;

  /**
   * Class to apply to the title of the dialog
   */
  @Input()
  titleClass = 'dialog_header_color';

  /**
   * Class to apply to the body of the dialog
   */
  @Input()
  bodyClass = 'dialog_body_color';

  /**
   * Height of the dialog (can use any height measurement - e.g. 66vh default)
   */
  @Input()
  height = '66vh';

  /**
   * Width of the dialog (can use any width measurement - e.g. 1000px default)
   */
  @Input()
  width = '1000px';

  /**
   * Reference to the PrimeNG Dialog
   */
  @ViewChild('dialog', {static: false})
  dialog: Dialog;

  /**
   * Event Emitter for when the dialog is closed
   */
  @Output()
  closed: EventEmitter<any> = new EventEmitter();

  /**
   * Null the object to close the dialog, emit the close event.
   */
  close(): void {
    // this.dialog.close(new Event(''));
    this.object = null;
    this.closed.emit({});
  }

  /**
   * Open the dialog, if we're on a phone or tablet, make the dialog takeover the screen.
   */
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

  /**
   * Gets the default style to be used by the PrimeNG Dialog.
   */
  getStyle(): any {
    return {
      'overflow-y': 'auto',
      'width': this.width,
      'height': this.height
    };
  }

}
