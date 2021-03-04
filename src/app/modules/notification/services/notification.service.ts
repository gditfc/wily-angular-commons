import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../models/notification.model';

/**
 * Service for adding/deleting notifications
 */
@Injectable()
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
   * The number of milliseconds before an added notification automatically removes itself
   * @private
   */
  private notificationLife = 5000;

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
   * Set the number of milliseconds before added notifications disappear
   * @param milliseconds the number of milliseconds to set
   */
  setNotificationLife(milliseconds: number): void {
    this.notificationLife = milliseconds;
  }
}
