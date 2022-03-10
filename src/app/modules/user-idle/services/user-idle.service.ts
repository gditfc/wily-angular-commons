import { Injectable, NgZone, Optional } from '@angular/core';
import {
  from,
  fromEvent,
  interval,
  merge,
  Observable,
  of,
  Subject,
  Subscription,
  timer
} from 'rxjs';
import {
  bufferTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  scan,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import {UserIdleConfig} from '../models/user-idle-config.model';

/**
 * Service to track whether or not the current user is idle
 */
@Injectable({
  providedIn: 'root'
})
export class UserIdleService {

  /**
   * Observable that emits based on the configured ping millisecond count
   */
  ping$: Observable<any> = null as any;

  /**
   * Events that can interrupts user's inactivity timer.
   */
  protected activityEvents$: Observable<any> = null as any;

  /**
   * Subject that tracks when the idle timer is running
   * @protected
   */
  protected _timerStart = new Subject<boolean>();

  /**
   * Subject that tracks when the user has been determined to be idle
   * @protected
   */
  protected _idleDetected = new Subject<boolean>();

  /**
   * Subject fired when the user has timed out
   * @protected
   */
  protected _timeout = new Subject<boolean>();

  /**
   * Observable representing a merge of activity events (mouse move, window resize and keydown)
   * @protected
   */
  protected idle$: Observable<any> = null as any;

  /**
   * Observable representing a timer that fires every second until the configured count is met
   * @protected
   */
  protected timer$: Observable<any> = null as any;

  /**
   * Idle value in milliseconds.
   * Default equals to 10 minutes.
   */
  protected idleMillisec = 600 * 1000;

  /**
   * Idle buffer wait time milliseconds to collect user action
   * Default equals to 1 Sec.
   */
  protected idleSensitivityMillisec = 1000;

  /**
   * Timeout value in seconds.
   * Default equals to 5 minutes.
   */
  protected timeout = 300;

  /**
   * Ping value in milliseconds.
   * Default equals to 2 minutes.
   */
  protected pingMillisec = 120 * 1000;

  /**
   * Timeout status.
   */
  protected isTimeout = false;

  /**
   * Timer of user's inactivity is in progress.
   */
  protected isInactivityTimer = false;

  /**
   * Boolean representing if the user is idle
   * @protected
   */
  protected isIdleDetected = false;

  /**
   * Subscription object to store the idle subscription
   * @protected
   */
  protected idleSubscription: Subscription = null as any;

  /**
   * Dependency injection site
   * @param config the optional config value
   * @param _ngZone the angular zone
   */
  constructor(@Optional() config: UserIdleConfig, private _ngZone: NgZone) {
    if (config) {
      this.setConfig(config);
    }
  }

  /**
   * Start watching for user inactivity
   */
  startWatching(): void {
    if (!this.activityEvents$) {
      this.activityEvents$ = merge(
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'resize'),
        fromEvent(document, 'keydown')
      );
    }

    this.idle$ = from(this.activityEvents$);

    if (this.idleSubscription) {
      this.idleSubscription.unsubscribe();
    }

    // If any of user events is not active for idle-seconds when start timer.
    this.idleSubscription = this.idle$
      .pipe(
        bufferTime(this.idleSensitivityMillisec), // Starting point of detecting of user's inactivity
        filter(
          arr => !arr.length && !this.isIdleDetected && !this.isInactivityTimer
        ),
        tap(() => {
          this.isIdleDetected = true;
          this._idleDetected.next(true);
        }),
        switchMap(() =>
          this._ngZone.runOutsideAngular(() =>
            interval(1000).pipe(
              takeUntil(
                merge(
                  this.activityEvents$,
                  timer(this.idleMillisec).pipe(
                    tap(() => {
                      this.isInactivityTimer = true;
                      this._timerStart.next(true);
                    })
                  )
                )
              ),
              finalize(() => {
                this.isIdleDetected = false;
                this._idleDetected.next(false);
              })
            )
          )
        )
      )
      .subscribe();

    this.setupTimer(this.timeout);
    this.setupPing(this.pingMillisec);
  }

  /**
   * Stop the timer and unsubscribe from the idle subscription
   */
  stopWatching(): void {
    this.stopTimer();
    if (this.idleSubscription) {
      this.idleSubscription.unsubscribe();
    }
  }

  /**
   * Return observable for timer's countdown number that emits after idle.
   */
  onTimerStart(): Observable<number> {
    return this._timerStart.pipe(
      distinctUntilChanged(),
      switchMap(start => (start ? this.timer$ : of(null)))
    );
  }

  /**
   * Return observable for timeout is fired.
   */
  onTimeout(): Observable<boolean> {
    return this._timeout.pipe(
      filter(timeout => !!timeout),
      tap(() => (this.isTimeout = true)),
      map(() => true)
    );
  }

  /**
   * Reset the timer
   */
  resetTimer(): void {
    this.stopTimer();
    this.isTimeout = false;
  }

  /**
   * Set up the idle config
   * @param config the config to set
   * @private
   */
  private setConfig(config: UserIdleConfig): void {
    if (config.idle) {
      this.idleMillisec = config.idle * 1000;
    }
    if (config.ping) {
      this.pingMillisec = config.ping * 1000;
    }
    if (config.idleSensitivity) {
      this.idleSensitivityMillisec = config.idleSensitivity * 1000;
    }
    if (config.timeout) {
      this.timeout = config.timeout;
    }
  }

  /**
   * Stop the timer
   * @private
   */
  private stopTimer(): void {
    this.isInactivityTimer = false;
    this._timerStart.next(false);
  }

  /**
   * Setup timer.
   *
   * Counts every seconds and return n+1 and fire timeout for last count.
   * @param timeout Timeout in seconds.
   */
  protected setupTimer(timeout: number): void {
    this._ngZone.runOutsideAngular(() => {
      this.timer$ = interval(1000).pipe(
        take(timeout),
        map(() => 1),
        scan((acc, n) => acc + n),
        tap(count => {
          if (count === timeout) {
            this._timeout.next(true);
          }
        })
      );
    });
  }

  /**
   * Setup ping.
   *
   * Pings every ping-seconds only if is not timeout.
   * @param pingMillisec
   */
  protected setupPing(pingMillisec: number): void {
    this.ping$ = interval(pingMillisec).pipe(filter(() => !this.isTimeout));
  }
}
