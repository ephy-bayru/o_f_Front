import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, retryWhen, delay, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly maxRetryAttempts = 3;
  private readonly retryDelay = 1000;

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      this.retryAfterDelay(),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      finalize(() => {
        // FIXME:
      })
    );
  }

  private retryAfterDelay(): (src: Observable<HttpEvent<any>>) => Observable<HttpEvent<any>> {
    let retries = this.maxRetryAttempts;
  
    return (source: Observable<HttpEvent<any>>) =>
      source.pipe(
        retryWhen(errors =>
          errors.pipe(
            delay(this.retryDelay),
            map((error, index) => {
              if (retries-- > 0 && !error.url?.endsWith('/login')) {
                return error;
              } else {
                throw error;
              }
            })
          )
        )
      );
  }
  

  private handleError(error: HttpErrorResponse): Observable<never> {
    let userMessage = 'An error occurred. Please try again.';

    if (error.error instanceof ErrorEvent) {
      userMessage = `An error occurred: ${error.error.message}`;
    } else {
      if (error.error.message) {
        userMessage = error.error.message;
      } else {
        switch (error.status) {
          case 401:
            this.router.navigate(['/auth/login']);
            userMessage = 'Unauthorized request. Please login again.';
            break;
          case 403:
            userMessage = 'You do not have permission to perform this action.';
            break;
          case 404:
            this.router.navigate(['/404']);
            break;
          case 429:
            userMessage = 'Too many requests. Please slow down.';
            break;
          case 500:
            userMessage = 'An error occurred on the server. Please try again later.';
            this.router.navigate(['/error']);
            break;
        }
      }
    }

    this.notificationService.showError(userMessage, 5000);
    console.log('Error: ' + userMessage);
    return throwError(() => error);
  }
}

export const errorInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
];
