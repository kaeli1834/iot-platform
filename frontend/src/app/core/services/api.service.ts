import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Interface for HTTP request options
 */
interface HttpRequestOptions {
  headers?: Record<string, string>;
  timeout?: number; // in ms, default 30000
  params?: Record<string, any>;
}

/**
 * Interface for standardized error response
 */
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;
  private readonly DEFAULT_TIMEOUT = 30000; // 30 seconds

  constructor(private http: HttpClient) {}

  // --------------------
  // GET
  // --------------------
  get<T>(path: string, options?: HttpRequestOptions): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}${path}`, {
        params: this.buildParams(options?.params),
        headers: options?.headers,
      })
      .pipe(
        timeout(options?.timeout || this.DEFAULT_TIMEOUT),
        catchError((error) => this.handleError(error))
      );
  }

  // --------------------
  // POST
  // --------------------
  post<T>(path: string, body?: unknown, options?: HttpRequestOptions): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${path}`, body, {
        headers: options?.headers,
      })
      .pipe(
        timeout(options?.timeout || this.DEFAULT_TIMEOUT),
        catchError((error) => this.handleError(error))
      );
  }

  // --------------------
  // PUT
  // --------------------
  put<T>(path: string, body?: unknown, options?: HttpRequestOptions): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}${path}`, body, {
        headers: options?.headers,
      })
      .pipe(
        timeout(options?.timeout || this.DEFAULT_TIMEOUT),
        catchError((error) => this.handleError(error))
      );
  }

  // --------------------
  // PATCH
  // --------------------
  patch<T>(path: string, body?: unknown, options?: HttpRequestOptions): Observable<T> {
    return this.http
      .patch<T>(`${this.baseUrl}${path}`, body, {
        headers: options?.headers,
      })
      .pipe(
        timeout(options?.timeout || this.DEFAULT_TIMEOUT),
        catchError((error) => this.handleError(error))
      );
  }

  // --------------------
  // DELETE
  // --------------------
  delete<T>(path: string, options?: HttpRequestOptions): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}${path}`, {
        headers: options?.headers,
      })
      .pipe(
        timeout(options?.timeout || this.DEFAULT_TIMEOUT),
        catchError((error) => this.handleError(error))
      );
  }

  // --------------------
  // Helpers
  // --------------------
  private buildParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    if (!params) return httpParams;

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value);
      }
    });

    return httpParams;
  }

  private handleError(error: any): Observable<never> {
    let apiError: ApiError;

    if (error instanceof HttpErrorResponse) {
      // HTTP error
      apiError = {
        status: error.status,
        message: error.error?.message || this.getDefaultErrorMessage(error.status),
        details: error.error,
      };
    } else if (error.name === 'TimeoutError') {
      // Timeout
      apiError = {
        status: 0,
        message: 'Request timeout. Please try again.',
      };
    } else {
      // Network error or other
      apiError = {
        status: 0,
        message: error.message || 'An unknown error occurred',
        details: error,
      };
    }

    this.logError(apiError);
    return throwError(() => apiError);
  }

  private getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not found';
      case 500:
        return 'Internal server error';
      case 502:
        return 'Bad gateway';
      case 503:
        return 'Service unavailable';
      default:
        return 'An error occurred';
    }
  }

  private logError(error: ApiError): void {
    console.error('[API ERROR]', {
      status: error.status,
      message: error.message,
      timestamp: new Date().toISOString(),
      ...(error.details && { details: error.details }),
    });
  }
}
