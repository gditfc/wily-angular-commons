import {Component, ViewChild} from '@angular/core';
import {DialogComponent} from './modules/dialog/dialog.component';
import {PushContainerComponent} from './modules/push-container/push-container.component';

/**
 * App Component to test out stuff built here. Not useful for anything else. Should not be exported by this package.
 */
@Component({
  selector: 'wily-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /**
   * App Title
   */
  title = 'app';

  /**
   * Object to be used to pop a dialog
   */
  obj: any;

  /**
   * Reference to the dialog component
   */
  @ViewChild('dialog')
  dialog: DialogComponent;

  /**
   * Push Container component.
   */
  @ViewChild('pushContainerLeft')
  pushContainerLeft: PushContainerComponent;

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Open the dialog
   */
  showDialog(): void {
    this.obj = {};
    this.dialog.open();
  }

  /**
   * Icon Selected event handler.
   *
   * @param event
   */
  iconSelected(event: any) {
    console.log(event.value);
  }
}
