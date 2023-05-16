
from demo.user_intolerances import UserIntolerancesRepository
from demo.user_intolerances import UserIntolerance
from demo.user_intolerances import IntoleranceLevel


class UserIntolerancesMother:

    def __init__(self, intolerances: list[UserIntolerance]):
        self._intolerances = intolerances

    @classmethod
    def vegan(cls):
        return UserIntolerancesMother(intolerances=[UserIntolerance(intolerance_level=IntoleranceLevel.LOW, product='beef')])

    def build(self):
        return self._intolerances


class UserIntolerancesRepositoryFake(UserIntolerancesRepository):

    def __init__(self):
        self._user_intolerances = {}

    def get_user_intolerances(self, user_id: str) -> list[UserIntolerance]:
        return self._user_intolerances.get(user_id, [])

    def set_user_intolerances(self, user_id: str, intolerances: list[UserIntolerance]):
        self._user_intolerances[user_id] = intolerances
