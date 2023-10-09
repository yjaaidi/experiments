import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  TemplateRef,
} from '@angular/core';
import { GridComponent } from '../shared/grid.component';
import { RecipePreviewComponent } from './recipe-preview.component';
import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { trackById } from '../shared/track-by-id';
import { Recipe } from '@whiskmate/recipe-core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-recipe-list',
  template: `
    <wm-grid>
      <wm-recipe-preview
        *ngFor="let recipe of recipes; trackBy: trackById"
        [recipe]="recipe"
      >
        <ng-container
          *ngTemplateOutlet="actionsTemplateRef; context: { $implicit: recipe }"
        ></ng-container>
      </wm-recipe-preview>
    </wm-grid>
  `,
  imports: [
    GridComponent,
    RecipePreviewComponent,
    NgForOf,
    NgTemplateOutlet,
    NgIf,
  ],
})
export class RecipeListComponent {
  @Input({ required: true }) recipes!: Recipe[];

  @ContentChild('actions') actionsTemplateRef!: TemplateRef<{
    $implicit: Recipe;
  }>;

  trackById = trackById;
}
