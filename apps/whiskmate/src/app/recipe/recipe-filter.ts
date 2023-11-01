export interface RecipeFilter {
  keywords?: string;
}

export function createRecipeFilter(filter: RecipeFilter): RecipeFilter {
  return filter;
}
