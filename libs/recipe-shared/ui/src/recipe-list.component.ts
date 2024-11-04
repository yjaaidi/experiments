import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Recipe } from '@whiskmate/recipe-shared/core';
import { GridComponent } from '@whiskmate/shared/ui';
import { RecipePreviewComponent } from './recipe-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-recipe-list',
  imports: [GridComponent, RecipePreviewComponent, NgTemplateOutlet],
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
})
export class RecipeListComponent {
  recipes = input.required<Recipe[]>();

  actionsTemplateRef =
    contentChild.required<TemplateRef<{ $implicit: Recipe }>>('actions');
}
