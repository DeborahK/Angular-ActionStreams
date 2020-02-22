import { Component, ChangeDetectionStrategy } from '@angular/core';

import { EMPTY, combineLatest } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  showImage = false;
  errorMessage = '';
  pageSizes = this.productService.pageSizes;
  selectedButton = 2;

  // Current filter/paging criteria
  filter$ = this.productService.filterAction$;
  pageSize$ = this.productService.pageSizeAction$;
  currentPage$ = this.productService.currentPage$;

  // Totals
  totalResults$ = this.productService.totalResults$;
  totalPages$ = this.productService.totalPages$;

  // Whether to disable the next/prev
  disablePrevious$ = this.currentPage$
    .pipe(
      map(pageNumber => pageNumber === 1)
    )
  // Whether to disable the next/prev
  disableNext$ = combineLatest([
    this.currentPage$,
    this.totalPages$
  ]).pipe(
    map(([currentPage, totalPages]) => currentPage === totalPages)
  )

  // Products adjusted as per the criteria
  products$ = this.productService.products$
    .pipe(
      catchError(error => {
        this.errorMessage = error;
        return EMPTY;
      }));

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
