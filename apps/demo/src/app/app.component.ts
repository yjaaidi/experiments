import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { suspensify } from '@jscutlery/operators';
import { computedAsync } from 'ngxtension/computed-async';
import { Observable, map } from 'rxjs';
import { Recipe } from './recipe';
import { RecipeComponent } from './recipe.component';

@Component({
  standalone: true,
  selector: 'demo-root',
  template: `
    <input [formControl]="keywordsCtrl" type="text" />

    @if (recipes(); as suspense) {
      @if (suspense.hasValue) {
        @for (recipe of suspense.value; track recipe.id) {
          <demo-recipe [recipe]="recipe" />
        }
      }
      @if (suspense.pending) {
        <div>Loading...</div>
      }
      @if (suspense.hasError) {
        <div>🚨 Error.</div>
      }
    }
  `,
  imports: [ReactiveFormsModule, RecipeComponent],
})
export class AppComponent {
  keywordsCtrl = new FormControl();
  keywords = toSignal(this.keywordsCtrl.valueChanges);

  // 1. Async computed approach
  recipes = computedAsync(() =>
    this._getRecipes(this.keywords()).pipe(suspensify()),
  );

  // 2. RxJS approach
  // recipes = toSignal(
  //   this.keywordsCtrl.valueChanges.pipe(
  //     // 👇 this is necessary here because valueChanges
  //     // only emits on first input change
  //     startWith(''),
  //     switchMap((keywords) => {
  //       return this._getRecipes(keywords);
  //     })
  //   ),
  //   {
  //     initialValue: [],
  //   }
  // );

  private _http = inject(HttpClient);

  // 3. Manual effect approach
  // recipes = signal<Recipe[]>([]);
  // constructor() {
  //   effect((onCleanup) => {
  //     const subscription = this._getRecipes(this.keywords()).subscribe(
  //       (recipes) => this.recipes.set(recipes)
  //     );
  //     onCleanup(() => subscription.unsubscribe());
  //   });
  // }

  private _getRecipes(keywords: string): Observable<Recipe[]> {
    return this._http
      .get<RecipesResponse>('https://recipes-api.marmicode.io/recipes', {
        params: keywords
          ? {
              q: this.keywords(),
            }
          : {},
      })
      .pipe(
        map((data) =>
          data.items.map((item) => ({
            id: item.id,
            name: item.name,
            pictureUri: item.picture_uri,
          })),
        ),
      );
  }
}

interface RecipesResponse {
  items: Array<{
    id: string;
    name: string;
    picture_uri: string;
  }>;
}
