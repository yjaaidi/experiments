from demo.recipes import Recipe, RecipesRepository


class RecipesRepositoryFake(RecipesRepository):

    def __init__(self):
        self._user_recipes = {}

    def add_user_recipe(self, user_id: str, recipe: Recipe):
        self._user_recipes.setdefault(user_id, [])
        self._user_recipes[user_id] = [*self._user_recipes[user_id], recipe]

    def get_user_recipes(self, user_id: str) -> list[Recipe]:
        return self._user_recipes.get(user_id, [])


class RecipeMother:

    def __init__(self, recipe: Recipe):
        self._recipe = recipe

    @classmethod
    def withName(cls, name: str):
        return RecipeMother(recipe=Recipe(id="rec_{name}".format(name=name.lower().replace(' ', '')), name=name, ingredients=[]))

    def build(self):
        return self._recipe

    def withSomeIngredients(self):
        self._recipe.ingredients = ['🍖 beef', '🥯 bun']
        return self

    def withVeganIngredients(self):
        self._recipe.ingredients = ['🥯 bun', '🥬 lettuce', '🍅 tomato']
        return self
