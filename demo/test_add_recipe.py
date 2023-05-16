from unittest import mock
from demo.add_recipe import DuplicateRecipeError, UserRecipeIntoleranceError

import pytest

from demo.add_recipe import add_recipe
from demo.recipes.testing import RecipeMother, RecipesRepositoryFake
from demo.user_intolerances.testing import UserIntolerancesMother, UserIntolerancesRepositoryFake


def test_user_can_add_recipe(fake_user_recipes_repo):
    burger = RecipeMother.withName('burger').withSomeIngredients().build()
    add_recipe(user_id="usr_foo", recipe=burger)

    # check recipe is added to user's recipes
    user_recipes = fake_user_recipes_repo.get_user_recipes(user_id="usr_foo")
    assert len(user_recipes) == 1
    assert user_recipes[0].id == 'rec_burger'


def test_user_cant_add_duplicate_recipe():
    burger = RecipeMother.withName('burger').withSomeIngredients().build()

    add_recipe(user_id="usr_foo", recipe=burger)

    with pytest.raises(DuplicateRecipeError):
        add_recipe(user_id="usr_foo", recipe=burger)


def test_user_cant_add_recipe_if_allergic_to_its_ingredients():
    burger = RecipeMother.withName('burger').withSomeIngredients().build()

    with pytest.raises(UserRecipeIntoleranceError):
        add_recipe(user_id="usr_vegan", recipe=burger)


@pytest.fixture(autouse=True)
def fake_user_intolerances_repo():
    """
    This fixture is used to replace the UserIntolerancesRepository implementation
    with a fake with the following settings:
    - user 'usr_vegan' is vegan
    - all other users have no intolerances
    """
    fake = UserIntolerancesRepositoryFake()

    fake.set_user_intolerances(
        user_id="usr_vegan", intolerances=UserIntolerancesMother.vegan().build())

    with mock.patch('demo.add_recipe.UserIntolerancesRepositoryImpl', lambda: fake):
        yield fake


@pytest.fixture(autouse=True)
def fake_user_recipes_repo():
    fake = RecipesRepositoryFake()
    with mock.patch('demo.add_recipe.RecipesRepositoryImpl', lambda: fake):
        yield fake
