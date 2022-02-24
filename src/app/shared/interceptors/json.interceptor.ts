import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

/**
 * This interceptor will force the Content-Type header to application/json so that each http call doesn't have to.
 */
@Injectable()
export class JsonInterceptor implements HttpInterceptor {

  /**
   * Intercept method to set the content type header.
   *
   * @param req
   * @param next
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clone = req.clone({setHeaders: {'Content-Type': 'application/json'}});
    return next.handle(clone);
  }

}
