import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  TemplateRef,
} from '@angular/core';
import { GridComponent } from '../shared/grid.component';
import { Recipe } from './recipe';
import { RecipePreviewComponent } from './recipe-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-list',
  template: `
    <wm-grid>
      @for (recipe of recipes(); track recipe.id) {
        <wm-recipe-preview [recipe]="recipe">
          <ng-container
            *ngTemplateOutlet="
              actionsTemplateRef();
              context: { $implicit: recipe }
            "
          ></ng-container>
        </wm-recipe-preview>
      }
    </wm-grid>
  `,
  imports: [GridComponent, RecipePreviewComponent, NgTemplateOutlet],
})
export class RecipeListComponent {
  recipes = input.required<Recipe[]>();

  actionsTemplateRef = contentChild.required<
    TemplateRef<{
      $implicit: Recipe;
    }>
  >('actions');
}
