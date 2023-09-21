import { RequestHandler, Response } from 'express';
import { IngredientDto } from '../../dtos/model/ingredient-dto';
import { ingredientRepository } from '../../infra/ingredient.repository';

 const postIngredientHandler: RequestHandler = (
  req,
  res: Response<IngredientDto>
) => {
  res.status(201).send(
    ingredientRepository.addIngredient({
      recipeId: req.params.recipe_id,
      ...req.body,
    })
  );
};

export const postIngredientRouter = {
  'post-ingredient': postIngredientHandler,
};
