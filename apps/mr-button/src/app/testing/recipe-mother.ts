import { createRecipe } from '../recipe/recipe';
import { Recipe } from './../recipe/recipe';

class RecipeMother {
  withBasicInfo(name: string): NestedRecipeMother {
    const slug = name
      .toLowerCase()
      .replace(/ +/g, '-')
      .replace(/([^\w-])/g, '');
    return new NestedRecipeMother(
      createRecipe({
        id: `rec_${slug}`,
        name,
        description: `A delicious ${name}.`,
        ingredients: [],
        pictureUri: `https://pictures.marmicode.io/${slug}.jpg`,
        steps: [],
      })
    );
  }
}

class NestedRecipeMother {
  constructor(private _recipe: Readonly<Recipe>) {}

  build() {
    return this._recipe;
  }

  withSomeIngredients(): NestedRecipeMother {
    return this._extendWith({
      ingredients: [
        {
          name: 'Salt',
        },
        {
          name: 'Pepper',
        },
      ],
    });
  }

  private _extendWith(recipe: Partial<Recipe>) {
    return new NestedRecipeMother({ ...this._recipe, ...recipe });
  }
}

export const recipeMother = new RecipeMother();
