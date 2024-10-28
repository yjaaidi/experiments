import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-recipe-ui',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-ui.component.html',
  styleUrl: './recipe-ui.component.css',
})
export class RecipeUiComponent {}
