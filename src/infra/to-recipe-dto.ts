import { RecipeDto } from '../dtos/model/recipe-dto';
import { Recipe } from './recipe.repository';

export function toRecipeDto(recipe: Recipe): RecipeDto {
  return {
    id: recipe.id,
    created_at: recipe.createdAt.toISOString(),
    name: recipe.name,
    picture_uri: recipe.pictureUri ?? null,
  };
}
