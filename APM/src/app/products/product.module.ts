import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProductListComponent } from './product-list.component';
import { ProductDetailComponent } from './product-detail.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProductListComponent
      },
      {
        path: ':id',
        component: ProductDetailComponent,
      }
    ])
  ],
  declarations: [
    ProductListComponent,
    ProductDetailComponent
  ]
})
export class ProductModule { }
