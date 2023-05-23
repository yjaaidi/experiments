import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { RecipeRepository } from './recipe-repository.service';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { RecipeDetailModule } from './recipe-detail.component';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from './recipe';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-detail-page',
  imports: [RecipeDetailModule, NgIf, NgForOf, AsyncPipe],
  template: `
        <wm-recipe-detail *ngIf="recipe$ | async as recipe" [recipe]="recipe"/>
    `,
})
export class RecipeDetailPageComponent {
  recipe$: Observable<Recipe | null>;

  private _recipeRepository = inject(RecipeRepository);
  private _route = inject(ActivatedRoute);

  constructor() {
    this.recipe$ = this._route.paramMap.pipe(
      map((params) => params.get('recipeId')),
      switchMap((recipeId) =>
        recipeId ? this._recipeRepository.getRecipe(recipeId) : of(null)
      )
    );
  }
}

export default RecipeDetailPageComponent;
