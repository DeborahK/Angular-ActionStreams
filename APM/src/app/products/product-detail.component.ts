import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EMPTY } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ProductService } from './product.service';
import { Product } from './product';

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit {
  errorMessage = '';

  product$ = this.productService.product$
    .pipe(
      catchError(error => {
        this.errorMessage = error;
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
