import {CognitoAuth, CognitoAuthSession} from 'amazon-cognito-auth-js';
import {Router} from '@angular/router';

export abstract class CognitoAuthService {

  private retryCount = 0;
  private initPromise: Promise<any>;

  protected auth: any;
  protected session: CognitoAuthSession;

  protected constructor() {}

  init(): Promise<any> {
    this.initPromise = this.defer();
    this.auth = new CognitoAuth(this.getAuthData());
    this.setupCognito();

    return this.initPromise;
  }

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

  private login(): void {
    this.auth.getSession();
  }

  public authenticated(): boolean {
    if (this.session) {
      return this.session.isValid();
    }

    return false;
  }

  public logout(): void {
    this.auth.signOut();
  }

  public getUser(): any {
    if (this.session) {
      const idToken = this.session.getIdToken().getJwtToken();
      if (idToken) {
        return JSON.parse(atob(idToken.split('.')[1]));
      }
    }

    return null;
  }

  public getIdToken(): string {
    if (this.session) {
      return this.session.getIdToken().getJwtToken();
    }

    return null;
  }

  private scheduleTokenRefresh(): void {
    const expiryDate = (this.getUser().exp * 1000) - new Date().getTime() - 1000;

    setTimeout(() => {
      this.auth.refreshSession(this.session.getRefreshToken().getToken());
    }, expiryDate);
  }

  abstract getRouter(): Router;

  abstract getAuthData(): any;

}
