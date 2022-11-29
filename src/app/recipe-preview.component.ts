import { Recipe } from './recipe';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardComponent } from './card.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-preview',
  imports: [CardComponent, NgIf],
  template: `<wm-card *ngIf="recipe" [pictureUri]="recipe.pictureUri">
    <h2 data-role="recipe-name" role="heading" aria-label="Recipe's Name">{{ recipe.name }}</h2>
    <ng-content></ng-content>
  </wm-card>`,
  styles: [
    `
      h2 {
        font-size: 1em;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  ],
})
export class RecipePreviewComponent {
  @Input() recipe?: Recipe;
}