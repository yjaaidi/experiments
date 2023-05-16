import requests
from abc import ABC, abstractmethod
from dataclasses import asdict, dataclass


@dataclass()
class Recipe:
    id: str
    name: str
    ingredients: list[str]


class RecipesRepository(ABC):

    @abstractmethod
    def add_user_recipe(self, user_id: str, recipe: Recipe):
        raise NotImplementedError()

    @abstractmethod
    def get_user_recipes(self, user_id: str) -> list[Recipe]:
        raise NotImplementedError()


class RecipesRepositoryImpl(RecipesRepository):

    def add_user_recipe(self, user_id: str, recipe: Recipe):
        requests.post(
            '.../users/{user_id}/recipes'.format(user_id=user_id), json=asdict(recipe))

    def get_user_recipes(self, user_id: str) -> list[Recipe]:
        return requests.get('.../users/{user_id}/recipes'.format(user_id=user_id))
