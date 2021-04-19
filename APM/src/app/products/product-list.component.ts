import { Component, ChangeDetectionStrategy } from '@angular/core';

import { EMPTY, combineLatest, Subject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ProductService } from './product.service';
import { Product } from './product';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  showImage = false;
  pageSizes = this.productService.pageSizes;
  selectedButton = 2;

  // Error messages
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  // Current filter/paging criteria
  filter$ = this.productService.filterAction$;
  pageSize$ = this.productService.pageSizeAction$;
  currentPage$ = this.productService.currentPage$;

  // // Arrow key event
  // arrowRight$ = fromEvent(document, 'keydown')
  //   .pipe(
  //     tap(e => console.log(e)),
  //     filter((e: KeyboardEvent) => e.key === 'ArrowRight'),
  //     tap((e: KeyboardEvent) => this.setPage(1))
  //   );

  // Totals
  totalResults$ = this.productService.totalResults$;
  totalPages$ = this.productService.totalPages$;

  // Whether to disable the next/prev
  disablePrevious$: Observable<boolean> = this.currentPage$
    .pipe(
      map(pageNumber => pageNumber === 1)
    );

  // Whether to disable the next/prev
  disableNext$: Observable<boolean> = combineLatest([
    this.currentPage$,
    this.totalPages$
  ]).pipe(
    map(([currentPage, totalPages]) => currentPage === totalPages)
  );

  // Products adjusted as per the criteria
  products$ = this.productService.products$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }));

  // Combine the streams for the view
  // TODO: Look into why this won't compile if the boolean streams are added here
  vm$ = combineLatest([
    this.filter$,
    this.pageSize$,
    this.currentPage$,
    this.totalResults$,
    this.totalPages$,
    this.products$
  ]).pipe(
    map(([filter, pageSize, currentPage, totalResults, totalPages, products]:
      [string, number, number, number, number, Product[]]) => ({
        filter, pageSize, currentPage, totalResults, totalPages, products
      }))
  );

  constructor(private productService: ProductService) { }

  doFilter(filter: string): void {
    this.productService.changeFilter(filter);
  }

  setPage(amount: number): void {
    this.productService.incrementPage(amount);
  }

  setPageSize(pageSize: number): void {
    this.selectedButton = pageSize;
    this.productService.changePageSize(pageSize);
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

}
