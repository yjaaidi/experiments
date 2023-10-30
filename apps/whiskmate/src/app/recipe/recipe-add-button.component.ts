import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Recipe } from './recipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-recipe-add-button',
  imports: [MatButtonModule],
  template: ` <button
    class="add-recipe-button"
    color="primary"
    data-role="add-recipe"
    mat-stroked-button
  >
    ADD
  </button>`,
})
export class RecipeAddButtonComponent {
  @Input({ required: true }) recipe!: Recipe;
}
