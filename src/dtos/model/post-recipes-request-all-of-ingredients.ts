/**
 * Recipe
 * Recipe management API.
 *
 * The version of the OpenAPI document: 0.1
 * Contact: kitchen@marmicode.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { IngredientNew } from './ingredient-new';


/**
 * Prefer using POST /recipes/{recipe_id}/ingredients
 */
/**
 * @type PostRecipesRequestAllOfIngredients
 * Prefer using POST /recipes/{recipe_id}/ingredients
 * @export
 */
export type PostRecipesRequestAllOfIngredients = Array<IngredientNew> | Array<string>;

