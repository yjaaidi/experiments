import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-recipe-shared-core',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-shared-core.component.html',
  styleUrl: './recipe-shared-core.component.css',
})
export class RecipeSharedCoreComponent {}
