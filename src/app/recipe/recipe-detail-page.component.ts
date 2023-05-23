import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { RecipeRepository } from './recipe-repository.service';
import { NgForOf, NgIf } from '@angular/common';
import { RecipeDetailModule } from './recipe-detail.component';

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
  @Input() set recipeId(recipeId: string) {
    this.recipeIdSig.set(recipeId);
  }

  recipeIdSig = signal<string | null>(null);
  recipe = toSignal(
    toObservable(this.recipeIdSig).pipe(
      switchMap((recipeId) =>
        recipeId ? this._recipeRepository.getRecipe(recipeId) : of(null)
      )
    )
  );

  private _recipeRepository = inject(RecipeRepository);
}

export default RecipeDetailPageComponent;
