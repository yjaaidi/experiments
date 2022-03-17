import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product',
  template: ` <h1>Products</h1> `
})
export class ProductsPageComponent {}

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: ProductsPageComponent }
    ])
  ],
  declarations: [ProductsPageComponent]
})
export class ProductsPageComponentModule {}

export default ProductsPageComponentModule;