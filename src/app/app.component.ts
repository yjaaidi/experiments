import { JsonPipe, NgFor, NgIf } from '@angular/common';
import {
  Component,
  Input,
  Signal,
  computed,
  effect,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Suspense, suspensify } from '@jscutlery/operators';
import { SuspensePending } from '@jscutlery/operators/src/lib/suspensify';
import { NEVER, Observable, defer, delay, map, of, throwError } from 'rxjs';

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
  imports: [NgFor, NgIf, RecipeComponent, JsonPipe],
  template: `
    <button (click)="previous()">PREVIOUS</button>
    <button (click)="next()">NEXT</button>

    <ng-container *ngIf="recipeSuspense() as recipe">
      <div *ngIf="!recipe.finalized">Loading...</div>
      <div *ngIf="recipe.hasError">Oups!</div>
      <app-recipe *ngIf="recipe.hasValue" [recipe]="recipe.value"></app-recipe>
    </ng-container>

    <hr />

    <h2>Similar recipes:</h2>
    <ng-container *ngIf="similarRecipesSuspense() as similarRecipes">
      <div *ngIf="!similarRecipes.finalized">Loading...</div>
      <div *ngIf="similarRecipes.hasError">Oups!</div>
      <ng-container *ngIf="similarRecipes.hasValue">
        <div *ngIf="similarRecipes.value.length === 0">🤷🏻‍♂️</div>
        <div *ngFor="let similarRecipe of similarRecipes.value">
          {{ similarRecipe }}
        </div>
      </ng-container>
    </ng-container>
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

  recipeSuspense = rxComputedSuspense(() =>
    this._getRecipe(this.recipeIndex())
  );
  similarRecipesSuspense = rxComputedSuspense(() => {
    const suspense = this.recipeSuspense();
    if (suspense.hasError) {
      throw suspense.error;
    }
    return suspense.hasValue ? this._getSimilarRecipes(suspense.value) : NEVER;
  });

  private _recipeGroups = [['🍔', '🍕', '🍟'], ['🍣'], ['🍜', '🍝'], ['🍺']];
  private _allRecipes = this._recipeGroups.flat();

  next() {
    this.recipeIndex.update((index) => (index + 1) % this._allRecipes.length);
  }

  previous() {
    this.recipeIndex.update((index) =>
      index === 0 ? this._allRecipes.length - 1 : index - 1
    );
  }

  private _getRecipe(recipeIndex: number) {
    const allRecipes = this._recipeGroups.flat();
    return of(allRecipes[recipeIndex % allRecipes.length]).pipe(
      delay(200),
      map((recipe) => {
        if (recipe === '🍺') {
          throw new Error('🍺 is not a recipe');
        }
        return recipe;
      })
    );
  }

  private _getSimilarRecipes(recipe: string) {
    const recipeGroup =
      this._recipeGroups.find((group) => group.includes(recipe)) ?? [];
    return of(recipeGroup.filter((_recipe) => _recipe !== recipe)).pipe(
      delay(200)
    );
  }
}

function rxComputedSuspense<T>(fn: () => Observable<T>) {
  return rxComputed(() => defer(fn).pipe(suspensify()), {
    initialValue: pending,
  });
}

function rxComputed<T, U extends unknown = undefined>(
  fn: () => Observable<T>,
  { initialValue }: { initialValue?: U } = {}
): Signal<T | U> {
  const sig = signal<Suspense<T | U>>(pending);

  effect(
    (onCleanup) => {
      const sub = fn()
        .pipe(suspensify())
        .subscribe((value) => sig.set(value));
      onCleanup(() => sub.unsubscribe());
    },
    { allowSignalWrites: true }
  );

  return computed(() => {
    const suspense = sig();
    if (suspense.hasError) {
      throw suspense.error;
    }
    if (suspense.hasValue) {
      return suspense.value;
    }
    return initialValue as U;
  });
}

function toSuspenseSignal<T>(source$: Observable<T>) {
  return toSignal(source$.pipe(suspensify()), {
    requireSync: true,
  });
}

const pending: SuspensePending = {
  pending: true,
  hasError: false,
  hasValue: false,
  finalized: false,
};
