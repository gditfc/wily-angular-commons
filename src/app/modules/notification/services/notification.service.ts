import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../models/notification.model';

/**
 * Service for adding/deleting notifications
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  /**
   * Valid characters that a notification ID can be composed from
   * @private
   */
  private static readonly ID_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  /**
   * BehaviorSubject tracking an array of active notifications
   * @private
   */
  private readonly _notifications = new BehaviorSubject<Array<Notification>>([]);

  /**
   * The number of milliseconds before an added notification automatically removes itself.
   * Defaults to 3000 milliseconds
   * @private
   */
  private notificationLife = 3000;

  /**
   * Generate a random ID
   * @private
   */
  private static generateId(): string {
    let result = '';

    for (let i = 0; i < 10; i++) {
      result += this.ID_CHARACTERS.charAt(Math.floor(Math.random() * this.ID_CHARACTERS.length));
    }

    return result;
  }

  /**
   * Dependency injection site
   */
  constructor() { }

  /**
   * Add a notification
   * @param notification the notification to add
   */
  add(notification: Notification): void {
    notification.id = NotificationService.generateId();

    const notifications = this._notifications.getValue();
    notifications.push(notification);

    this._notifications.next(notifications);

    setTimeout(
      () => this.deleteNotification(notification.id as string),
      this.notificationLife
    );
  }

  /**
   * Delete a notification
   * @param id the ID of the notification to delete
   */
  deleteNotification(id: string): void {
    const notifications = this._notifications.getValue();
    const foundIndex = notifications.findIndex(notification => notification.id === id);

    if (foundIndex > -1) {
      notifications.splice(foundIndex, 1);
    }

    this._notifications.next(notifications);
  }

  /**
   * Get notifications as an Observable
   */
  getNotifications(): Observable<Array<Notification>> {
    return this._notifications.asObservable();
  }

  /**
   * Set the number of milliseconds before added notifications disappear
   * @param milliseconds the number of milliseconds to set
   */
  setNotificationLife(milliseconds: number): void {
    this.notificationLife = milliseconds;
  }
}
