import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_BASE_URL } from 'src/app/config/config';

export abstract class CrudService<T, ID> {
  protected headers: HttpHeaders;
  protected baseUrl: string;

  protected constructor(
    protected http: HttpClient,
    protected endpoint: string
  ) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.baseUrl = API_BASE_URL;
  }

  private getUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  save(t: T, endpoint?: string): Observable<T> {
    const url = endpoint ? this.getUrl(endpoint) : this.getUrl(this.endpoint);
    return this.http.post<T>(url, t, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  update(id: ID, t: T): Observable<T> {
    return this.http.put<T>(this.getUrl(`${this.endpoint}/${id}`), t, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  findOne(id: ID): Observable<T> {
    return this.http.get<T>(this.getUrl(`${this.endpoint}/${id}`), { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  findAll(): Observable<T[]> {
    return this.http.get<T[]>(this.getUrl(this.endpoint), { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: ID): Observable<void> {
    return this.http.delete<void>(this.getUrl(`${this.endpoint}/${id}`), { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  protected handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred. Please try again later.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error(errorMessage));
  }
}
