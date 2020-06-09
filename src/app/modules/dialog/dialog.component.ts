import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DialogService} from '../../shared/services/dialog.service';
import {Observable} from 'rxjs/internal/Observable';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';
import {map, mapTo, startWith, tap} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';

/**
 * Wily Dialog component wraps a PrimeNG dialog to make it behave in the exact way that we want to, along with styles to make it look
 * consistent across all use cases.
 */
@Component({
  selector: 'wily-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.css'],
  animations: [
    trigger('dialog', [
      state('void', style({ transform: 'scale(0.5)', opacity: '0' })),
      transition('void => *', [
        style({ height: '*', width: '*' }),
        animate('.15s 0ms ease-in-out', style({ transform: 'scale(1)', opacity: '1' }) )
      ]),
      transition(':leave', [
        animate('.15s 0ms ease-in-out', style({ transform: 'scale(0.5)', opacity: '0' }))
      ]),
    ])
  ]
})
export class DialogComponent {

  effectiveWidth$: Observable<string> = fromEvent(window, 'resize').pipe(
    startWith(window.innerWidth),
    map(_______ => window.innerWidth),
    map(windowWidth => {
      let width: number;
      if (this.width.includes('px')) {
        width = parseInt(this.width.substring(0, this.width.length - 2), 10);
        if (width > windowWidth) {
          width = windowWidth;
        }
        return width + 'px';
      }
      return this.width;
    })
  );

  /**
   * Object to operate whether the dialog is open/closed
   */
  object: any;

  /**
   * Object to operate whether the dialog is open/closed
   */
  @Input('object') set setObject(value: any) {
    if (this.object && !value) {
      this.dialogService.unregisterDialog(this);
    }
    if (!this.object && value) {
      this.dialogService.registerDialog(this);
    }
    this.object = value;
  }

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
   * Show or hide the title bar
   */
  @Input()
  showTitle = true;

  /**
   * Class to apply to the body of the dialog
   */
  @Input()
  bodyClass = 'dialog_body_color';

  /**
   * Height of the dialog (can use any height measurement)
   */
  @Input()
  height = '500px';

  /**
   * Width of the dialog (can use any width measurement)
   */
  @Input()
  width = '900px';

  /**
   * Event Emitter for when the dialog is closed
   */
  @Output()
  closed: EventEmitter<any> = new EventEmitter();

  /**
   * Dependency injection site
   * @param dialogService the dialog service
   */
  constructor(private dialogService: DialogService) { }

  /**
   * Null the object to close the dialog, emit the close event.
   */
  close(): void {
    this.object = null;
    this.dialogService.unregisterDialog(this);
    this.closed.emit({});
  }

  /**
   * Open the dialog, if we're on a phone or tablet, make the dialog takeover the screen.
   * Method has no body, it's just here for compatibility with the old dialog that wrapped
   * the p-dialog
   */
  open(): void {

  }

}
