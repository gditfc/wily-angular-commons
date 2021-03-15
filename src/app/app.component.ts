import {Component, ViewChild} from '@angular/core';
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
   * List of icons (name/class pairs)
   */
  readonly icons: Array<{ class: string }> = [
    { class: 'fa-address' },
    { class: 'fa-alpha-text' },
    { class: 'fa-checkbox' },
    { class: 'fa-date' },
    { class: 'fa-date-range' },
    { class: 'fa-divider' },
    { class: 'fa-document-upload' },
    { class: 'fa-dropdown' },
    { class: 'fa-email' },
    { class: 'fa-existing-license' },
    { class: 'fa-fein' },
    { class: 'fa-group-pid' },
    { class: 'fa-html' },
    { class: 'fa-icon-header' },
    { class: 'fa-lab-pid' },
    { class: 'fa-license' },
    { class: 'fa-mmis-npi' },
    { class: 'fa-money' },
    { class: 'fa-multi-select' },
    { class: 'fa-npi' },
    { class: 'fa-numeric-text' },
    { class: 'fa-person-name' },
    { class: 'fa-pharmacy-pid' },
    { class: 'fa-phone' },
    { class: 'fa-physical-address' },
    { class: 'fa-physician-pid' },
    { class: 'fa-pid' },
    { class: 'fa-radio-buttons' },
    { class: 'fa-ssn' },
    { class: 'fa-sidebar-close' },
    { class: 'fa-sidebar-open' },
    { class: 'fa-text-area' },
    { class: 'fa-text-box' }
  ];

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
   * Push Container component.
   */
  @ViewChild('pushContainerLeft')
  pushContainerLeft: PushContainerComponent;

  text: string;

  value = ['value', 'value6', 'value4'];

  icon = 'fas fa-car';

  /**
   * Constructor
   */
  constructor(private notificationService: NotificationService) { }

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
