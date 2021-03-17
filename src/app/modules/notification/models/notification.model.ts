/**
 * Model representing a notification
 */
export interface Notification {

  /**
   * The notification ID
   */
  id?: string;

  /**
   * The notification severity
   */
  severity: 'success' | 'info' | 'warn' | 'error';

  /**
   * The notification summary
   */
  summary: string;

  /**
   * The notification detail
   */
  detail?: string;
}
