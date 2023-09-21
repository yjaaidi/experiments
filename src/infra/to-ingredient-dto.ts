import { IngredientDto } from '../dtos/model/ingredient-dto';
import { Ingredient } from './ingredient.repository';

export function toIngredientDto(ingredient: Ingredient): IngredientDto {
  return {
    id: ingredient.id,
    name: ingredient.name,
  };
}
