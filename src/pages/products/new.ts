import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products-new',
  template: ` <h1>New Product</h1> `
})
export class NewProductPageComponent {}

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: NewProductPageComponent }
    ])
  ],
  declarations: [NewProductPageComponent]
})
export class ProductPageComponentModule {}

export default ProductPageComponentModule;