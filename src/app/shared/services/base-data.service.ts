import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs/index';

export class BaseDataService {

  protected getBaseUrl(): string {
    return '';
  }

  constructor(protected http: HttpClient) {
  }

  handleGet(url: string, params?: HttpParams): Observable<any> {
    return this.handleGetDetailed(url, false, params);
  }

  handleGetOne(url: string): Observable<any> {
    return this.handleGet(url).pipe(
      map(d => d),
      catchError(this.handleError)
    );
  }

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
