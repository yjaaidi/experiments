import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-recipe-shared-ui',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-shared-ui.component.html',
  styleUrl: './recipe-shared-ui.component.css',
})
export class RecipeSharedUiComponent {}
