import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { RecipeRepository } from './recipe-repository.service';
import { NgForOf, NgIf } from '@angular/common';
import { RecipeDetailModule } from './recipe-detail.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-detail-page',
  imports: [RecipeDetailModule, NgIf, NgForOf],
  template: `
        <wm-recipe-detail *ngIf="recipe() as recipeValue" [recipe]="recipeValue"/>
    `,
})
export class RecipeDetailPageComponent {
  recipeId = computed(() => this._paramMap()?.get('recipeId'));
  recipe = toSignal(
    toObservable(this.recipeId).pipe(
      switchMap((recipeId) =>
        recipeId ? this._recipeRepository.getRecipe(recipeId) : of(null)
      )
    )
  );
  private _paramMap = toSignal(inject(ActivatedRoute).paramMap);
  private _recipeRepository = inject(RecipeRepository);
}

export default RecipeDetailPageComponent;
