import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  template: ` <h1>Product</h1> `
})
export class ProductPageComponent {}

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: ProductPageComponent}
    ])
  ],
  declarations: [ProductPageComponent]
})
export class ProductPageComponentModule {}

export default ProductPageComponentModule;