import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardComponent } from '@whiskmate/shared/ui';
import { NgIf } from '@angular/common';
import { Recipe } from '@whiskmate/recipe-shared/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-recipe-preview',
  imports: [CardComponent, NgIf],
  template: ` <wm-card *ngIf="recipe" [pictureUri]="recipe.pictureUri">
    <h2 data-role="recipe-name">{{ recipe.name }}</h2>
    <div class="actions">
      <ng-content />
    </div>
  </wm-card>`,
  styles: [
    `
      h2 {
        font-size: 1.2em;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .actions {
        display: flex;
        justify-content: center;
      }
    `,
  ],
})
export class RecipePreviewComponent {
  @Input({ required: true }) recipe!: Recipe;
}
