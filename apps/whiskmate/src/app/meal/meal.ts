export interface Meal {
  date: Date;
  recipeInfo: {
    id: string;
    name: string;
    pictureUri: string;
  };
}

export function createMeal(meal: Meal): Meal {
  return meal;
}
