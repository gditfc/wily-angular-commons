import {Component, ViewChild} from '@angular/core';
import {DialogLegacyComponent} from './modules/dialog-legacy/dialog-legacy.component';
import { Notification } from './modules/notification/models/notification.model';
import { NotificationService } from './modules/notification/services/notification.service';
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
  @ViewChild('dialog')
  dialog: DialogLegacyComponent;

  /**
   * Push Container component.
   */
  @ViewChild('pushContainerLeft')
  pushContainerLeft: PushContainerComponent;

  text: string;

  value = ['value', 'value6', 'value4'];

  /**
   * Constructor
   */
  constructor(private notificationService: NotificationService) { }

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

  /**
   * Icon select opened event handler
   */
  iconSelectOpened() {
    console.log('Icon select opened');
  }

  /**
   * Icon select closed event handler
   */
  iconSelectClosed(): void {
    console.log('Icon select closed');
  }

  /**
   * Rich text editor text changed event handler
   * @param event
   */
  handleEditorTextChange(event: any): void {
    const { textValue } = event;
    console.log('Editor is empty:');
    console.log(
      !(textValue as string)?.replace(/\s+/g, '')?.length
    );
  }

  onPushContainerClose() {
    console.log('Push container closed.');
  }

  addNotification(severity: 'success' | 'warn' | 'error' | 'info'): void {
    const notification = { severity } as Notification;

    switch (severity) {
      case 'success':
        notification.summary = 'Success Message';
        notification.detail = 'This is a success message!';
        break;
      case 'warn':
        notification.summary = 'Warning Message';
        notification.detail = 'This is a warning message!';
        break;
      case 'error':
        notification.summary = 'Error Message';
        notification.detail = 'This is an error message!';
        break;
      case 'info':
        notification.summary = 'Info Message';
        notification.detail = 'This is an info message!';
        break;
    }

    this.notificationService.addNotification(notification);
  }
}
