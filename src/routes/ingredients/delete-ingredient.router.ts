import { RequestHandler } from 'express';
import { ingredientRepository } from '../../infra/ingredient.repository';

 const deleteIngredientHandler: RequestHandler = (req, res) => {
  ingredientRepository.removeIngredient(req.params.ingredient_id);
  res.sendStatus(204);
};

export const deleteIngredientRouter = {
  'delete-ingredient': deleteIngredientHandler,
};
