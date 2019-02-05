import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {CognitoAuthService} from '../services/cognito-auth.service';

export abstract class CognitoAuthInterceptor implements HttpInterceptor {

  protected static readonly HTTP_PREFIX_LENGTH = 7;
  protected static readonly HTTPS_PREFIX_LENGTH = 8;

  protected constructor(
    protected cognitoAuthService: CognitoAuthService
  ) {}

  protected isWhitelistUrl(req: HttpRequest<any>): boolean {
    const index: number = req.url.startsWith('https') ?
                            CognitoAuthInterceptor.HTTPS_PREFIX_LENGTH :
                            CognitoAuthInterceptor.HTTP_PREFIX_LENGTH;

    const baseUrl: string = req.url.substring(index, req.url.indexOf('/', index));

    return this.getWhitelistUrls().includes(baseUrl);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isWhitelistUrl(req)) {
      const clone = req.clone({setHeaders: {'Authorization': 'Bearer ' + this.cognitoAuthService.getIdToken()}});
      return next.handle(clone);
    }

    return next.handle(req);
  }

  abstract getWhitelistUrls(): Array<string>;

}
