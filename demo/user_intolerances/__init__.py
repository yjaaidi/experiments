import requests
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum


class IntoleranceLevel(Enum):
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'


@dataclass()
class UserIntolerance:
    intolerance_level: IntoleranceLevel
    product: str


class UserIntolerancesRepository(ABC):

    @abstractmethod
    def get_user_intolerances(self, user_id: str) -> list[UserIntolerance]:
        raise NotImplementedError()


class UserIntolerancesRepositoryImpl(UserIntolerancesRepository):
    def get_user_intolerances(self, user_id: str) -> list[UserIntolerance]:
        return requests.get('.../users/{user_id}/intolerances'.format(user_id=user_id))
