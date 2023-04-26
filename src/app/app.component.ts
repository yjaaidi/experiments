import { NgIf } from '@angular/common';
import { Component, Input, computed, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, delay, throwError, catchError, EMPTY, map, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-recipe',
  template: `{{ recipe }}`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class RecipeComponent {
  @Input() recipe!: string;
}

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [NgIf, RecipeComponent],
  template: `
    <button (click)="next()">NEXT</button>
    <app-recipe *ngIf="recipe() as recipeValue" [recipe]="recipeValue" />
    <div *ngIf="error()">{{ error() }}</div>
  `,
  styles: [
    `
      :host {
        display: block;
        text-align: center;
      }
    `,
  ],
})
export class AppComponent {
  error = signal(null);
  recipeIndex = signal(0);
  recipe = toSignal(
    toObservable(this.recipeIndex).pipe(
      switchMap((recipeIndex) =>
        this.getRecipe(recipeIndex).pipe(
          catchError((error) => {
            this.error.set(error);
            return of(null);
          })
        )
      )
    )
  );

  getRecipe(recipeIndex: number) {
    const recipes = ['🍔', '🍕', '🍺', '🍣'];
    return of(recipes[recipeIndex % recipes.length]).pipe(
      map((recipe) => {
        if (recipe === '🍺') {
          throw new Error('🍺 is not a recipe');
        }
        return recipe;
      })
    );
  }

  next() {
    this.recipeIndex.update((index) => index + 1);
  }
}
