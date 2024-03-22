import { Component } from '@angular/core';
import { Recipe } from './recipe';
import { RecipeComponent } from './recipe.component';

@Component({
  standalone: true,
  selector: 'demo-root',
  templateUrl: './app.component.html',
  imports: [RecipeComponent],
})
export class AppComponent {
  recipes: Recipe[] = [
    {
      id: 'burger',
      name: 'Burger',
      pictureUri:
        'https://www.ninkasi.fr/wp-content/uploads/2022/06/header_burger.jpg"',
    },
  ];
}
