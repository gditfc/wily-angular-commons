import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from './models/notification.model';
import { NotificationService } from './services/notification.service';

/**
 * Component for displaying notifications
 */
@Component({
  selector: 'wily-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  /**
   * Array of notifications as an Observable
   */
  readonly notifications$: Observable<Array<Notification>> = this.service.getNotifications();

  /**
   * Map of notification severity to color class
   */
  readonly severityColorMap = {
    'success': 'bg_green',
    'warn': 'bg_orange',
    'error': 'bg_red',
    'info': 'bg_blue'
  };

  /**
   * Map of notification severity to icon class
   */
  readonly severityIconMap = {
    'success': 'fa-check-circle',
    'warn': 'fa-exclamation-circle',
    'error': 'fa-times-circle',
    'info': 'fa-info-circle'
  };

  /**
   * Dependency injection site
   * @param service the NotificationService
   */
  constructor(private service: NotificationService) { }

  /**
   * Init component
   */
  ngOnInit(): void { }

  /**
   * Delete a notification
   * @param id the ID of the notification to delete
   */
  deleteNotification(id: string): void {
    this.service.deleteNotification(id);
  }
}
