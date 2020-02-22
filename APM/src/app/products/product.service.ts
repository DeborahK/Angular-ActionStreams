import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, map, switchMap, filter, shareReplay } from 'rxjs/operators';

import { Product } from './product';
import { Criteria } from './criteria';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  pageSizes = [2, 3, 5];

  // Handle criteria change action
  criteriaSubject = new BehaviorSubject<Criteria>({
    listFilter: '',
    pageSize: this.pageSizes[0],
    pageNumber: 1
  });
  criteriaAction$ = this.criteriaSubject.asObservable();

  // Handle page increment/decrement action
  pageIncrementSubject = new BehaviorSubject<number>(0);
  pageIncrementAction$ = this.pageIncrementSubject.asObservable();

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
    this.criteriaAction$])
    .pipe(
      // Perform the filtering
      map(([products, criteria]) =>
        this.performFilter(products, criteria.listFilter))
    );

  // Total results
  totalResults$ = this.filteredProducts$
    .pipe(
      map(products => products.length),
    );

  // Total pages
  totalPages$ = combineLatest([
    this.totalResults$,
    this.criteriaAction$
  ])
    .pipe(
      map(([total, criteria]) =>
        Math.ceil(total / criteria.pageSize))
    )

  currentPage$ = combineLatest([
    this.criteriaAction$,
    this.totalPages$,
    this.pageIncrementAction$
  ])
    .pipe(
      tap(console.log),
      map(([criteria, maxPageNumber, pageIncrement]) => {
        // Add the amount to the current page number
        let pageNumber = criteria.pageNumber + pageIncrement;
        // Adjust for first and last page
        if (pageNumber <= 0) pageNumber = 1;
        if (pageNumber > maxPageNumber) pageNumber = maxPageNumber;
        return pageNumber;
      })
    );

  products$ = combineLatest([
    this.filteredProducts$,
    this.criteriaAction$])
    .pipe(
      // Perform the filtering
      map(([filteredProducts, criteria]) =>
        filteredProducts.slice((criteria.pageNumber - 1) * criteria.pageSize,
          criteria.pageNumber * criteria.pageSize)
      )
    );

  // If the paging can be done on the server, it would looke more like this
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

  // Criteria was changed
  changeCriteria(criteria: Criteria): void {
    const newCriteria = { ...this.criteriaSubject.value, ...criteria }
    console.log(newCriteria);
    this.criteriaSubject.next(newCriteria);
  }

  // Selected product was changed
  changeSelectedProduct(selectedProductId: number): void {
    this.productSelectedSubject.next(selectedProductId);
  }

  // Increment/decrement the current page
  incrementPage(amount: number) {
    this.pageIncrementSubject.next(amount);
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
