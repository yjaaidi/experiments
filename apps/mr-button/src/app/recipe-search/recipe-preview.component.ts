import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardComponent } from './../shared/card.component';
import { Recipe } from '../recipe/recipe';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-preview',
  imports: [CardComponent, MatButtonModule, NgIf],
  template: `<wm-card *ngIf="recipe" [pictureUri]="recipe.pictureUri">
    <h2 data-role="recipe-name">{{ recipe.name }}</h2>
    <div class="flex-row">
      <ng-content></ng-content>
      <div class="share-btn-container">
        <button color="accent" mat-stroked-button>SHARE</button>
      </div>
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

      .share-btn-container {
        flex-basis: 300px;
      }
    `,
  ],
})
export class RecipePreviewComponent {
  @Input() recipe?: Recipe;
}
