import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CrudService } from 'src/app/core/services/crud.service';
import { API_BASE_URL } from 'src/app/config/config';
import { IProduct, IProductResponse } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService extends CrudService<IProduct, string> {
  protected override baseUrl: string;

  constructor(protected httpClient: HttpClient) {
    super(httpClient, '/products');
    this.baseUrl = API_BASE_URL;
  }

  createProduct(product: IProduct): Observable<IProduct> {
    return this.save(product).pipe(
      map((res: IProduct) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  updateProduct(id: string, product: IProduct): Observable<IProduct> {
    return this.update(id, product).pipe(
      map((res: IProduct) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  getProduct(id: string): Observable<IProduct> {
    return this.findOne(id).pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError(this.handleError)
    );
  }
  

  getAllProducts(pageSize: number, currentPage: number): Observable<IProductResponse> {
    return this.http
      .get<IProductResponse>(`${this.baseUrl}${this.endpoint}`, {
        params: {
          pageSize: pageSize.toString(),
          page: currentPage.toString()
        },
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }
  

  deleteProduct(id: string): Observable<void> {
    return this.delete(id).pipe(catchError(this.handleError));
  }
}
