import {CognitoAuth, CognitoAuthSession} from 'amazon-cognito-auth-js';
import {Router} from '@angular/router';

export class CognitoAuthService {

  private retryCount = 0;

  protected auth: any;
  protected session: CognitoAuthSession;

  protected constructor(
    protected router: Router,
    protected authData: any
  ) {
    this.auth = new CognitoAuth(authData);
    this.setupCognito();
  }

  private setupCognito(): void {
    // This will be called upon invocation of this.auth.getSession()
    this.auth.userhandler = {
      onSuccess: (result) => {
        this.retryCount = 0;
        this.session = result;
        this.scheduleTokenRefresh();
      },
      onFailure: (error) => {
        console.error(error);

        if (this.retryCount >= 3) {
          this.retryCount = 0;
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
      this.router.navigate(['']);
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
    return this.session.getIdToken().getJwtToken();
  }

  private scheduleTokenRefresh(): void {
    const expiryDate = (this.getUser().exp * 1000) - new Date().getTime() - 1000;

    setTimeout(() => {
      this.auth.refreshSession(this.session.getRefreshToken().getToken());
    }, expiryDate);
  }

}
