// Treat Run: bones collected in the mini-game add up to real meals for shelter pets.
export const BONES_PER_MEAL = 50;

export const mealsFrom = (bones: number) => Math.floor(bones / BONES_PER_MEAL);
export const bonesToNextMeal = (bones: number) => BONES_PER_MEAL - (bones % BONES_PER_MEAL);
