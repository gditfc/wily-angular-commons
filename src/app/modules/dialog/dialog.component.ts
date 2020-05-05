import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';

/**
 * Wily Dialog component wraps a PrimeNG dialog to make it behave in the exact way that we want to, along with styles to make it look
 * consistent across all use cases.
 */
@Component({
  selector: 'wily-dialog',
  templateUrl: 'dialog.component.html'
})
export class DialogComponent {

  @ViewChildren(DialogComponent)
  childDialogs: QueryList<DialogComponent>;

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
   * Height of the dialog (can use any height measurement)
   */
  @Input()
  height: string;
  // @Input('height')
  // set setHeight(height: string) {
  //   this.height = height === 'auto' ? '' : height;
  // }
  //
  // height: string;

  /**
   * Width of the dialog (can use any width measurement)
   */
  @Input()
  width: string;
  // @Input('width')
  // set setWidth(width: string) {
  //   this.width = width === 'auto' ? '' : width;
  // }
  //
  // width: string;

  /**
   * Event Emitter for when the dialog is closed
   */
  @Output()
  closed: EventEmitter<any> = new EventEmitter();

  /**
   * Null the object to close the dialog, emit the close event.
   */
  close(): void {
    this.object = null;
    this.closed.emit({});
  }

  /**
   * Open the dialog, if we're on a phone or tablet, make the dialog takeover the screen.
   * Method has no body, it's just here for compatibility with the old dialog that wrapped
   * the p-dialog
   */
  open(): void { }

  handleEscapePress(): void {
    console.count();
    console.log(this.childDialogs);
  }

}
