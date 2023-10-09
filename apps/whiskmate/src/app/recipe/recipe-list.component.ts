import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  TemplateRef,
} from '@angular/core';
import { RecipePreviewComponent } from './recipe-preview.component';
import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { Recipe } from '@whiskmate/recipe-core';
import { GridComponent, trackById } from '@whiskmate/shared-ui';

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
