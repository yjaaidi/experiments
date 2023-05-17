
from abc import ABC, abstractmethod
from demo.recipes import RecipesRepository
from demo.recipes.testing import RecipeMother


# note: this is a contract that we can use to test any implementation of the RecipeRepository.
# It will make sure that the fake and the real implementation are compatible.
# This is not always straighforward as it depends on the remote service capabilities.
# Also, note that running this test against the fake implementation is a narrow test,
# while running it against the real implementation is probably a wide test.
class RecipeRepositoryContract(ABC):

    @abstractmethod
    def get_repo(self) -> RecipesRepository:
        raise NotImplementedError()

    def test_add_recipe(self):
        repo = self.get_repo()
        repo.add_user_recipe(
            user_id='usr_foo', recipe=RecipeMother.withName('Burger').withSomeIngredients().build())
        recipes = repo.get_user_recipes(user_id='usr_foo')
        burger = next(
            (recipe for recipe in recipes if recipe.name == 'Burger'), None)

        # note: note the flexibility here because with the real implementation
        # we will probaly call a remote service and it might already contain some recipes.
        assert len(recipes) >= 1
        assert len(burger.ingredients) >= 1
