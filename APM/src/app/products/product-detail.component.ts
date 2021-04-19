import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EMPTY, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ProductService } from './product.service';
import { Product } from './product';

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit {
  // Error messages
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  product$ = this.productService.product$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }));

  pageTitle$ = this.product$
    .pipe(
      map((p: Product) =>
        p ? `Product Detail for: ${p.productName}` : null)
    );

  constructor(private route: ActivatedRoute,
              private productService: ProductService) { }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.productService.changeSelectedProduct(+param);
    }
  }

}
