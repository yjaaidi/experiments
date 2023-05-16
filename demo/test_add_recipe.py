from unittest import mock
from demo.add_recipe import DuplicateRecipeError, UserRecipeIntoleranceError

import pytest

from demo.add_recipe import add_recipe
from demo.recipes.testing import RecipeMother, RecipesRepositoryFake
from demo.user_intolerances.testing import UserIntolerancesMother, UserIntolerancesRepositoryFake


def test_user_can_add_recipe(fake_user_recipes_repo):
    # note: factorizing the recipe in a fixture might harm readability.
    # While object mothers might be a bit more verbose, the intent is more explicit
    # and makes the tests more readable.
    burger = RecipeMother.withName('burger').withSomeIngredients().build()

    # note: predictable string literals can also improve readability
    # compared to random strings or variables like `foo.id`.
    add_recipe(user_id="usr_foo", recipe=burger)

    # check recipe is added to user's recipes

    # note: while we don't care in naming this test a unit test or not,
    # it might shock some people that we are using the `get_user_recipes` method here.
    # However, this is not a problem as we are not testing the implementation of the
    # `add_recipe` function, but its behavior and checking the content of the
    # fake (or maybe real repository) is probably the most structure agnostic
    # and intent-sharing way to do it.
    # What is the business expecting? That we call the database properly?
    # Or for the data to be in the database at the end?
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

    # todo: use dependency injection (e.g. https://fastapi.tiangolo.com/advanced/testing-dependencies/)
    # or a simple service locator
    with mock.patch('demo.add_recipe.UserIntolerancesRepositoryImpl', lambda: fake):
        yield fake


@pytest.fixture(autouse=True)
def fake_user_recipes_repo():
    fake = RecipesRepositoryFake()

    # todo: use dependency injection (e.g. https://fastapi.tiangolo.com/advanced/testing-dependencies/)
    # or a simple service locator
    with mock.patch('demo.add_recipe.RecipesRepositoryImpl', lambda: fake):
        yield fake
