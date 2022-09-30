import { Observable } from 'rxjs';
import { Recipe } from '../recipe/recipe';
import { RecipeFilter } from '../recipe/recipe-filter';

export abstract class RecipeRepositoryPort {
  abstract search(filter: RecipeFilter): Observable<Recipe[]>;
}
