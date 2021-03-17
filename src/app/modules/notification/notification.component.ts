import {
  animate,
  animateChild,
  query,
  stagger,
  style,
  transition,
  trigger
} from '@angular/animations';
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
  styleUrls: ['./notification.component.css'],
  animations: [
    // nice stagger effect when showing existing elements
    trigger('list', [
      transition(':enter', [
        // child animation selector + stagger
        query(
          '@items',
          stagger(300, animateChild()),
          { optional: true }
        )
      ]),
    ]),
    trigger('items', [
      // cubic-bezier for a tiny bouncing feel
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('0.65s cubic-bezier(.8,-0.6,0.2,1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate('0.65s cubic-bezier(.8,-0.6,0.2,1.5)',
          style({ transform: 'scale(0.5)', opacity: 0, height: '0px', margin: '0px', padding: '0px' }))
      ]),
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
