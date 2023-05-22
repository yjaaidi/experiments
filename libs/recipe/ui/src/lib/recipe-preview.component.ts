import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'whiskmate-recipe-preview',
  template: `{{ recipe }}`,
})
export class RecipePreviewComponent {
  @Input({ required: true }) recipe: unknown;
}

