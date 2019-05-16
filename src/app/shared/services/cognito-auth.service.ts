import {CognitoAuth, CognitoAuthSession} from 'amazon-cognito-auth-js';
import {Router} from '@angular/router';

/**
 * This is the service for interacting with Cognito. It should be extended and made Injectable.
 */
export abstract class CognitoAuthService {

  /**
   * Retry Count when there are errors logging in
   */
  private retryCount = 0;

  /**
   * Promise for App Initialization
   */
  private initPromise: Promise<any>;

  /**
   * Cognito Auth Data
   */
  protected auth: any;

  /**
   * Cognito Auth Session
   */
  protected session: CognitoAuthSession;

  /**
   * Protected constructor
   */
  protected constructor() {}

  /**
   * Init function for App Initialization. Will create the Cognito session and the promise will resolve when it's all done.
   */
  init(): Promise<any> {
    this.initPromise = this.defer();
    this.auth = new CognitoAuth(this.getAuthData());
    this.setupCognito();

    return this.initPromise;
  }

  /**
   * Promise deferment capability to support app initialization
   */
  private defer(): Promise<any> {
    let res, rej: any;

    const promise = new Promise<any>((resolve, reject) => {
      res = resolve;
      rej = reject;
    });

    (<any> promise).resolve = res;
    (<any> promise).reject = rej;

    return promise;
  }

  /**
   * Cognito set up and actions on what to do what should be done when cognito is successful or fails.
   */
  private setupCognito(): void {
    // This will be called upon invocation of this.auth.getSession()
    this.auth.userhandler = {
      onSuccess: (result) => {
        this.retryCount = 0;
        this.session = result;
        this.scheduleTokenRefresh();
        (<any> this.initPromise).resolve();
      },
      onFailure: (error) => {
        console.error(error);

        if (this.retryCount >= 3) {
          this.retryCount = 0;
          (<any> this.initPromise).reject();
          this.logout();
        } else {
          this.retryCount++;
        }

        this.login();
      }
    };

    this.auth.useCodeGrantFlow();

    if (window.location.href.includes('?code=')) {
      this.auth.parseCognitoWebResponse(window.location.href);
      this.getRouter().navigate(['']);
    } else {
      this.login();
    }
  }

  /**
   * Login function for Cognito
   */
  private login(): void {
    this.auth.getSession();
  }

  /**
   * Returns whether the user is authenticated or not
   */
  public authenticated(): boolean {
    if (this.session) {
      return this.session.isValid();
    }

    return false;
  }

  /**
   * Logs out of the Cognito session
   */
  public logout(): void {
    this.auth.signOut();
  }

  /**
   * Get the User from the Cognito Session
   */
  public getUser(): any {
    if (this.session) {
      const idToken = this.session.getIdToken().getJwtToken();
      if (idToken) {
        return JSON.parse(atob(idToken.split('.')[1]));
      }
    }

    return null;
  }

  /**
   * Get the ID Token to embed in the header for REST calls to the back end
   */
  public getIdToken(): string {
    if (this.session) {
      return this.session.getIdToken().getJwtToken();
    }

    return null;
  }

  /**
   * Token Refresh setup so that the session stays active.
   */
  private scheduleTokenRefresh(): void {
    const expiryDate = (this.getUser().exp * 1000) - new Date().getTime() - 1000;

    setTimeout(() => {
      this.auth.refreshSession(this.session.getRefreshToken().getToken());
    }, expiryDate);
  }

  /**
   * To be provided by the class extension
   */
  abstract getRouter(): Router;

  /**
   * Returns the auth data to be used in this parent class
   */
  abstract getAuthData(): any;

}
