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


export interface RecipeNewAllOf { 
    name?: string;
    type?: RecipeNewAllOf.TypeEnum;
}
export namespace RecipeNewAllOf {
    export type TypeEnum = 'entree' | 'plat' | 'dessert';
    export const TypeEnum = {
        Entree: 'entree' as TypeEnum,
        Plat: 'plat' as TypeEnum,
        Dessert: 'dessert' as TypeEnum
    };
}


