from demo.recipes.recipe_repository_contract import RecipeRepositoryContract
from demo.recipes.testing import RecipesRepositoryFake


class TestRecipeRepositoryFake(RecipeRepositoryContract):
    def get_repo(self):
        return RecipesRepositoryFake()
