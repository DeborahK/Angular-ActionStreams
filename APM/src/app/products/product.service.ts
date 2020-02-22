import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, map, switchMap, filter, shareReplay, scan } from 'rxjs/operators';

import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  pageSizes = [2, 3, 5];

  // Filter/paging criteria
  filterSubject = new BehaviorSubject<string>('');
  filterAction$ = this.filterSubject.asObservable();

  pageSizeSubject = new BehaviorSubject<number>(this.pageSizes[0]);
  pageSizeAction$ = this.pageSizeSubject.asObservable();

  pageNumberSubject = new BehaviorSubject<number>(1);

  // List of products
  allProducts$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      tap(response => console.log(JSON.stringify(response))),
      shareReplay(1),
      catchError(this.handleError)
    );

  // Filtered products
  // This is a separate stream to get the total number of products to display
  filteredProducts$ = combineLatest([
    this.allProducts$,
    this.filterAction$])
    .pipe(
      // Perform the filtering
      map(([products, filter]) =>
        this.performFilter(products, filter))
    );

  // Total results
  totalResults$ = this.filteredProducts$
    .pipe(
      map(products => products.length),
    );

  // Total pages
  totalPages$ = combineLatest([
    this.totalResults$,
    this.pageSizeAction$
  ])
    .pipe(
      map(([total, pageSize]) =>
        Math.ceil(total / pageSize))
    )

  // Current page
  currentPage$ = this.pageNumberSubject
    .pipe(
      scan((acc, one) => acc + one)
    );

  products$ = combineLatest([
    this.filteredProducts$,
    this.currentPage$,
    this.pageSizeAction$
  ])
    .pipe(
      // Perform the filtering
      map(([filteredProducts, pageNumber, pageSize]) =>
        filteredProducts.slice((pageNumber - 1) * pageSize,
          pageNumber * pageSize)
      )
    );

  // If the paging can be done on the server, it would look more like this
  // products$ = this.criteriaAction$
  //   .pipe(
  //     switchMap(criteria =>
  //       this.http.get(this.productsUrl, {
  //         params:
  //         {
  //           limit: criteria.pageSize.toString(),
  //           page: criteria.pageNumber.toString()
  //         }
  //       }
  //       )
  //     )
  //   );

  // Handle product selection action
  private productSelectedSubject = new BehaviorSubject<number>(0);
  productSelectedAction$ = this.productSelectedSubject.asObservable();

  product$ = this.productSelectedAction$
    .pipe(
      filter(id => !!id),
      switchMap(selectedProductId =>
        this.http.get<Product>(`${this.productsUrl}/${selectedProductId}`)
          .pipe(
            tap(response => console.log(JSON.stringify(response))),
            map(p => ({ ...p, profit: p.price - p.cost }) as Product),
            catchError(this.handleError)
          )
      ));

  constructor(private http: HttpClient) { }

  // Filter was changed
  changeFilter(filter: string): void {
    this.filterSubject.next(filter);
  }

  // Filter was changed
  changePageSize(size: number): void {
    this.pageSizeSubject.next(size);
    // When the page size changes, reset the page number to 0.
    //@@@
  }

  // Selected product was changed
  changeSelectedProduct(selectedProductId: number): void {
    this.productSelectedSubject.next(selectedProductId);
  }

  // Increment/decrement the current page
  incrementPage(amount: number) {
    this.pageNumberSubject.next(amount);
  }

  performFilter(products: Product[], filterBy: string) {
    filterBy = filterBy.toLocaleLowerCase();
    return products.filter((product: Product) =>
      product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
