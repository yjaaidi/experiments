import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'wm-recipe-filter',
  template: `
    <mat-form-field class="field">
      <mat-label>Keywords</mat-label>
      <input
        [ngModel]="keywords"
        (ngModelChange)="keywordsChange.emit($event)"
        matInput
        role="searchbox"
        type="text"
      />
    </mat-form-field>
  `,
  styles: `
    :host {
      display:block;
      margin: 1em;
    }

    .field {
      min-width: 300px;
    }
  `,
  standalone: false,
})
export class RecipeFilter {
  @Input() keywords?: string;
  @Output() keywordsChange = new EventEmitter<string>();
}

@NgModule({
  declarations: [RecipeFilter],
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule],
  exports: [RecipeFilter],
})
export class RecipeFilterModule {}
