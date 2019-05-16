import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs/index';

/**
 * This class provides some foundational REST endpoint call capabilities. It will do things like unpack lists into native objects and
 * return Observables so that you don't have to deal with mapping each and every response. It'll also log errors to the console and pass
 * along the error text for you.
 */
export class BaseDataService {

  /**
   * Extensions of this class can provide the Base URL so that they don't need to write out the full URL for every call made.
   */
  protected getBaseUrl(): string {
    return '';
  }

  /**
   * Takes an HTTPClient object so that it can make REST calls.
   *
   * @param http
   */
  constructor(protected http: HttpClient) {
  }

  /**
   * Gets a result from an endpoint. Executes an HTTP GET.
   *
   * @param url
   * @param params
   */
  handleGet(url: string, params?: HttpParams): Observable<any> {
    return this.handleGetDetailed(url, false, params);
  }

  /**
   * Will get a single result from an endpoint. Executes an HTTP GET.
   *
   * @param url
   */
  handleGetOne(url: string): Observable<any> {
    return this.handleGet(url).pipe(
      map(d => d),
      catchError(this.handleError)
    );
  }

  /**
   * Gets a List of Values
   * @param url
   */
  handleGetList(url: string): Observable<any> {
    return this.handleGet(url).pipe(
      map(d => d.data),
      catchError(this.handleError)
    );
  }

  handleFileGet(url: string, params?: HttpParams): Observable<any> {
    return this.handleGetDetailed(url, true, params);
  }

  private handleGetDetailed(url: string, isFileResponse: boolean, params?: HttpParams): Observable<any> {
    const options = this.getOptions(isFileResponse);
    options.params = params;

    return this.http.get(this.getBaseUrl() + url, options)
      .pipe(map(res => res), catchError(this.handleError));
  }

  handlePost(url: string, payload: any): Observable<any> {
    return this.handlePostDetailed(url, payload, true, false);
  }

  handlePostWithFileResponse(url: string, payload: any): Observable<any> {
    return this.handlePostDetailed(url, payload, true, true);
  }

  private handlePostDetailed(url: string, payload: any, isJson: boolean, isFileResponse: boolean): Observable<any> {
    let payloadFinal = payload;
    if (isJson) {
      payloadFinal = JSON.stringify(payload);
    }

    return this.http.post(this.getBaseUrl() + url, payloadFinal, this.getOptions(isFileResponse))
      .pipe(map(res => res), catchError(this.handleError));
  }

  handlePut(url: string, payload: any): Observable<any> {
    return this.handlePutDetailed(url, payload, true);
  }

  private handlePutDetailed(url: string, payload: any, isJson: boolean): Observable<any> {
    let payloadFinal = payload;
    if (isJson) {
      payloadFinal = JSON.stringify(payload);
    }

    return this.http.put(this.getBaseUrl() + url, payloadFinal, this.getOptions())
      .pipe(map(res => res), catchError(this.handleError));
  }

  handleDelete(url: string): Observable<any> {
    return this.http.delete(this.getBaseUrl() + url)
      .pipe(map(res => res), catchError(this.handleError));
  }

  handleObservableError(error: HttpErrorResponse): Observable<any> {
    this.handleError(error);
    return of(null);
  }

  handleError(error: HttpErrorResponse): Observable<any> {
    console.error(error);
    return throwError(error);
  }

  deepCopy<T>(o: T): T {
    return <T> JSON.parse(JSON.stringify(o));
  }

  private getOptions(isFileResponse?: boolean): any {
    const options: any = {};
    options.responseType = 'json';

    if (isFileResponse) {
      options.responseType = 'arraybuffer';
    }

    return options;
  }

}
