import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {CognitoAuthService} from '../services/cognito-auth.service';

/**
 * This Authentication Interceptor needs to be extended and then the getWhitelistUrls() needs to be implemented.
 * Any endpoints that are called that show up in the whitelist will have the Bearer token applied to it.
 */
export abstract class CognitoAuthInterceptor implements HttpInterceptor {

  /**
   * Character length of http://
   */
  protected static readonly HTTP_PREFIX_LENGTH = 7;

  /**
   * Character length of https://
   */
  protected static readonly HTTPS_PREFIX_LENGTH = 8;

  /**
   * Constructor
   *
   * @param cognitoAuthService
   */
  protected constructor(
    protected cognitoAuthService: CognitoAuthService
  ) {}

  /**
   * Takes a request to analyze its URL to determine if it is in the whitelist.
   *
   * @param req
   */
  protected isWhitelistUrl(req: HttpRequest<any>): boolean {
    const index: number = req.url.startsWith('https') ?
                            CognitoAuthInterceptor.HTTPS_PREFIX_LENGTH :
                            CognitoAuthInterceptor.HTTP_PREFIX_LENGTH;

    const baseUrl: string = req.url.substring(index, req.url.indexOf('/', index));

    return this.getWhitelistUrls().includes(baseUrl);
  }

  /**
   * If the endpoint that's being called is in the whitelist the bearer token will be added to the Authorization handler.
   *
   * @param req
   * @param next
   *
   * @returns Observable<HttpEvent<any>>
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isWhitelistUrl(req)) {
      return next.handle(req.clone({setHeaders: {'Authorization': 'Bearer ' + this.cognitoAuthService.getIdToken()}}));
    }

    return next.handle(req);
  }

  /**
   * Extension of this class must return all URLs that require the bearer token.
   *
   * @returns Array<string>
   */
  abstract getWhitelistUrls(): Array<string>;

}
