import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { NotificationService } from '../services/notification.service';
import { API_BASE_URL } from 'src/app/config/config';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  protected baseUrl: string;
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {this.baseUrl = API_BASE_URL;}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authService.getJwtToken()) {
      request = this.addToken(request, this.authService.getJwtToken());
    }
  
    return next.handle(request).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !request.url.endsWith('/login')
        ) {
          return this.handle401Error(request, next);
        } else {
          this.notificationService.showError(
            error.message || 'An error occurred'
          );
          console.log('Error: ' + error.message);
          return throwError(() => error);
        }
      })
    );
  }
  

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshTokenSubject.next(null);

        return this.authService.refreshToken().pipe(
            switchMap((token: any) => {
                this.isRefreshing = false;
                this.refreshTokenSubject.next(token.jwt);
                return next.handle(this.addToken(request, token.jwt));
            }),
            catchError(error => {
                this.isRefreshing = false;
                this.notificationService.showError('Could not refresh token');
                console.error('Error refreshing token: ', error);
                return throwError(() => error);
            }),
            finalize(() => {
                this.isRefreshing = false;
            })
        );
    } else {
        return this.refreshTokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap(jwt => {
                return next.handle(this.addToken(request, jwt));
            })
        );
    }
  }
}

export const jwtInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
];
