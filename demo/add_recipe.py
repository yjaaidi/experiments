from demo.recipes import Recipe, RecipesRepositoryImpl
from demo.user_intolerances import UserIntolerancesRepositoryImpl


class DuplicateRecipeError(Exception):
    pass


class UserRecipeIntoleranceError(Exception):
    pass


def add_recipe(user_id: str, recipe: Recipe):
    # todo: use dependency injection (e.g. https://fastapi.tiangolo.com/advanced/testing-dependencies/)
    # or a simple service locator
    user_intolerances_repo = UserIntolerancesRepositoryImpl()
    recipes_repo = RecipesRepositoryImpl()

    # Check if user has any intolerance to the recipe's ingredients.
    user_intolerances = user_intolerances_repo.get_user_intolerances(
        user_id=user_id)
    for ingredient in recipe.ingredients:
        tokens = ingredient.split(' ')
        if any(intolerance.product in tokens for intolerance in user_intolerances):
            raise UserRecipeIntoleranceError()

    # Check if user already has the recipe.
    user_recipes = recipes_repo.get_user_recipes(user_id=user_id)
    if any(recipe.id == user_recipe.id for user_recipe in user_recipes):
        raise DuplicateRecipeError()

    recipes_repo.add_user_recipe(user_id=user_id, recipe=recipe)
