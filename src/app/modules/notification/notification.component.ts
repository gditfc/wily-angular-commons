import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from './models/notification.model';
import { NotificationService } from './services/notification.service';

/**
 * Component for displaying notifications
 * // TODO: Finalize animation
 */
@Component({
  selector: 'wily-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
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
    'info': 'bg_purple'
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
