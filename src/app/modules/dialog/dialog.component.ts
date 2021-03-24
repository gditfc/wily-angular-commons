import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {DialogService} from '../../shared/services/dialog.service';
import {fromEvent, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';

/**
 * Component to display a dialog with dynamic content
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

  /**
   * Element reference to the dialog close button
   */
  @ViewChild('closeButton')
  closeButton: ElementRef<HTMLButtonElement>;

  /**
   * Observable to update the effective width of the dialog on screen resize
   */
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
   * Whether to show close button and allow escape to close
   */
  @Input()
  allowClose = true;

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
   * Event emitted when dialog has finished opening
   */
  @Output()
  opened = new EventEmitter<void>();

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
  }

  /**
   * Method for compatibility with legacy dialog API. Method does nothing.
   */
  open(): void { }

  /**
   * Emit closed/opened events based on state when dialog animation ends
   * @param event
   */
  onAnimationDone(event: AnimationEvent): void {
    if (event.fromState === 'void') {
      this.opened.emit();
    } else if (event.toState === 'void') {
      this.closed.emit();
    }
  }
}
