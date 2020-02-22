import { Component, ChangeDetectionStrategy } from '@angular/core';

import { EMPTY } from 'rxjs';
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

  // Current criteria
  criteria$ = this.productService.criteriaAction$;

  // Total results
  totalResults$ = this.productService.totalResults$;

  // Total pages
  totalPages$ = this.productService.totalPages$;

  // Products adjusted as per the criteria
  products$ = this.productService.products$
    .pipe(
      catchError(error => {
        this.errorMessage = error;
        return EMPTY;
      }));

  constructor(private productService: ProductService) { }

  doFilter(filter: string): void {
    this.productService.changeCriteria({ listFilter: filter });
  }

  setPage(amount: number): void {
    this.productService.incrementPage(amount);
  }

  setPageSize(pageSize: number): void {
    this.selectedButton = pageSize;
    this.productService.changeCriteria({ pageSize });
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

}
