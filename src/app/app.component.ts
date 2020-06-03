import {Component, ViewChild} from '@angular/core';
import {DialogLegacyComponent} from './modules/dialog-legacy/dialog-legacy.component';
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

  obj2: any;
  obj3: any;
  obj4: any;
  obj5: any;
  obj6: any;
  obj7: any;

  /**
   * Reference to the dialog component
   */
  @ViewChild('dialog', {static: false})
  dialog: DialogLegacyComponent;

  /**
   * Push Container component.
   */
  @ViewChild('pushContainerLeft', {static: false})
  pushContainerLeft: PushContainerComponent;

  text: string;

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
