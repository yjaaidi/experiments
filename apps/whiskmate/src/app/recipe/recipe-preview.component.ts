import { Recipe } from './recipe';
import { CardComponent } from './../shared/card.component';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-recipe-preview',
  imports: [CardComponent, NgIf],
  template: `<wm-card *ngIf="recipe" [pictureUri]="recipe.pictureUri">
    <h2 data-role="recipe-name">{{ recipe.name }}</h2>
    <ng-content></ng-content>
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
    `,
  ],
})
export class RecipePreviewComponent {
  @Input() recipe?: Recipe;
}
