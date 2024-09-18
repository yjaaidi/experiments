import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  TemplateRef,
} from '@angular/core';
import { Recipe } from './recipe';
import { GridComponent } from '../shared/grid.component';
import { RecipePreviewComponent } from './recipe-preview.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-recipe-list',
  template: `
    <wm-grid>
      @for (recipe of recipes; track recipe.id) {
        <wm-recipe-preview [recipe]="recipe">
          <ng-container
            *ngTemplateOutlet="
              actionsTemplateRef;
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
  @Input({ required: true }) recipes!: Recipe[];

  @ContentChild('actions') actionsTemplateRef!: TemplateRef<{
    $implicit: Recipe;
  }>;
}
