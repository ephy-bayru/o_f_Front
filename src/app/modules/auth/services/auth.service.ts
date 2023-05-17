import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, finalize, map } from 'rxjs/operators';
import { CrudService } from 'src/app/core/services/crud.service';
import { IUserPayload, IAuthResponse, IAuth } from '../models/user';
import { Router } from '@angular/router';
import { API_BASE_URL } from 'src/app/config/config';

@Injectable({ providedIn: 'root' })
export class AuthService extends CrudService<IUserPayload, string> {
  protected override baseUrl: string;
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(protected httpClient: HttpClient, private router: Router) {
    super(httpClient, '/auth');
    this.baseUrl = API_BASE_URL;
  }

  register(user: IUserPayload): Observable<IUserPayload> {
    return this.save(user, '/auth/register').pipe(
      map((res: IUserPayload) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  login(user: IAuth): Observable<IAuthResponse> {
    return this.httpClient
      .post<IAuthResponse>(`${this.baseUrl}${this.endpoint}/login`, user, {
        headers: this.headers,
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'error') {
            throw res;
          }

          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(res.data.user));

          return res;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  getJwtToken() {
    return localStorage.getItem('accessToken') || '';
  }

  refreshToken(): Observable<string> {
    if (!this.refreshTokenInProgress) {
      this.refreshTokenInProgress = true;
      this.refreshTokenSubject.next(null);

      const user = JSON.parse(localStorage.getItem('user') || '{}');

      return this.httpClient
        .post<{ accessToken: string }>(
          `${this.baseUrl}${this.endpoint}/refreshToken`,
          user,
          {
            headers: this.headers,
          }
        )
        .pipe(
          map((res) => {
            localStorage.setItem('accessToken', res.accessToken);
            this.refreshTokenInProgress = false;
            this.refreshTokenSubject.next(res.accessToken);
            return res.accessToken;
          }),
          catchError(this.handleError),
          finalize(() => {
            this.refreshTokenInProgress = false;
          })
        );
    } else {
      return this.refreshTokenSubject.pipe(filter((result) => result !== null));
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  hasRole(role: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === role;
  }
}

